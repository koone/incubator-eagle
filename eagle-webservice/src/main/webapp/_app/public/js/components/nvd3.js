/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

eagleComponents.service('nvd3', function() {
	var nvd3 = {
		charts: [],
		colors: [
			"#7CB5EC", "#F7A35C", "#90EE7E", "#7798BF", "#AAEEEE"
		]
	};

	// ============================================
	// =              Format Convert              =
	// ============================================

	/***
	 * Format: [series:{key:name, value: [{x, y}]}]
	 */

	nvd3.convert = {};
	nvd3.convert.eagle = function(seriesList) {
		return $.map(seriesList, function(series) {
			var seriesObj = $.isArray(series) ? {values: series} : series;
			if(!seriesObj.key) seriesObj.key = "value";
			return seriesObj;
		});
	};

	nvd3.convert.druid = function(seriesList) {
		var _seriesList = [];

		$.each(seriesList, function(i, series) {
			if(!series.length) return;

			// Fetch keys
			var _measure = series[0];
			var _keys = $.map(_measure.event, function(value, key) {
				return key !== "metric" ? key : null;
			});

			// Parse series
			_seriesList.push.apply(_seriesList, $.map(_keys, function(key) {
				return {
					key: key,
					values: $.map(series, function(unit) {
						return {
							x: new moment(unit.timestamp).valueOf(),
							y: unit.event[key]
						};
					})
				};
			}));
		});

		return _seriesList;
	};

	// ============================================
	// =                    UI                    =
	// ============================================
	// Resize with refresh
	function chartResize() {
		$.each(nvd3.charts, function(i, chart) {
			if(chart) chart.nvd3Update();
		});
	}
	$(window).on("resize.components.nvd3", chartResize);
	$("body").on("collapsed.pushMenu expanded.pushMenu", function() {
		setTimeout(chartResize, 300);
	});

	return nvd3;
});

/**
 * config:
 * 		chart:			Defined chart type: line, column, area
 * 		xTitle:			Defined x axis title.
 * 		yTitle:			Defined y axis title.
 * 		xType:			Defined x axis label type: number, decimal, time
 * 		yType:			Defined y axis label type
 * 		yMin:			Defined minimum of y axis
 * 		yMax:			Defined maximum of y axis
 * 		displayType:	Defined the chart display type. Each chart has own type.
 */
eagleComponents.directive('nvd3', function(nvd3) {
	'use strict';

	return {
		restrict: 'AE',
		scope: {
			nvd3: "=",
			title: "@?title",				// title
			chart: "@?chart",				// Same as config.chart
			config: "=?config",
			watching: "@?watching",			// Default watching data(nvd3) only. true will also watching chart & config. false do not watching.

			holder: "=?holder"				// Container for holder to call the chart function
		},
		controller: function($scope, $element, $attrs, $timeout) {
			var _config, _chartType;
			var _chart;
			var _chartCntr;
			var _holder, _holder_updateTimes;

			// Destroy
			function destroy() {
				var _index = $.inArray(_chart, nvd3.charts);
				if(!_chartCntr) return _index;

				// Clean events
				d3.select(_chartCntr)
					.on("touchmove",null)
					.on("mousemove",null, true)
					.on("mouseout" ,null,true)
					.on("dblclick" ,null)
					.on("click", null);

				// Clean elements
				d3.select(_chartCntr).selectAll("*").remove();
				$element.find(".nvtooltip").remove();
				$(_chartCntr).remove();

				// Clean chart in nvd3 pool
				nvd3.charts[_index] = null;
				_chart = null;

				return _index;
			}

			// Setup chart environment. Will clean old chart and build new chart if recall.
			function initChart() {
				// Clean up if already have chart
				var _preIndex = destroy();

				// Initialize
				_config = $.extend({}, $scope.config);
				_chartType = $scope.chart || _config.chart;
				_chartCntr = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
					.css("min-height", 50)
					.attr("_rnd", Math.random())
					.appendTo($element)[0];

				// Size
				if(_config.height) {
					$(_chartCntr).css("height", _config.height);
				}

				switch(_chartType) {
					case "line":
						_chart = nv.models.lineChart()
							.useInteractiveGuideline(true)
							.showLegend(true)
							.showYAxis(true)
							.showXAxis(true)
							.options({
								duration: 350
							});
						break;
					case "column":
						_chart = nv.models.multiBarChart()
							.groupSpacing(0.1)
							.options({
								duration: 350
							});
						break;
					case "area":
						_chart = nv.models.stackedAreaChart()
							.useInteractiveGuideline(true)
							.showLegend(true)
							.showYAxis(true)
							.showXAxis(true)
							.options({
								duration: 350
							});
						break;
					case "pie":
						_chart = nv.models.dimensionalPieChart()
							.x(function(d) { return d.key; })
							.y(function(d) { return d.values[d.values.length - 1].y; });
						break;
					default :
						throw "Type not defined: " + _chartType;
				}

				// nvd3 display Type
				// TODO: support type define

				// Define title
				if(_chartType !== 'pie') {
					if(_config.xTitle) _chart.xAxis.axisLabel(_config.xTitle);
					if(_config.yTitle) _chart.yAxis.axisLabel(_config.yTitle);
				}

				// Define label type
				var _tickMultiFormat = d3.time.format.multi([
					["%-I:%M%p", function(d) { return d.getMinutes(); }],
					["%-I%p", function(d) { return d.getHours(); }],
					["%b %-d", function(d) { return d.getDate() != 1; }],
					["%b %-d", function(d) { return d.getMonth(); }],
					["%Y", function() { return true; }]
				]);

				function _defineLabelType(axis, type) {
					if(!_chart) return;

					var _axis = _chart[axis + "Axis"];
					if(!_axis) return;

					switch(type) {
						case "decimal":
						case "decimals":
							_axis.tickFormat(d3.format('.02f'));
							break;
						case "text":
							if(axis === "x") {
								_chart.rotateLabels(10);
								_chart.reduceXTicks(false).staggerLabels(true);
							}
							_axis.tickFormat(function(d) {
								return d;
							});
							break;
						case "time":
							if(_chartType !== 'column') {
								_chart[axis + "Scale"](d3.time.scale());
								(function () {
									var measureSeries = null;
									$.each($scope.nvd3 || [], function(i, series) {
										var _len = (series.values || []).length;
										if(_len === 0) return;
										if(measureSeries === null || measureSeries.values.length < _len) measureSeries = series;
									});

									var width = $element.width() - 35;// Use default nvd3 margin. Hard code.
									if(!measureSeries || width <= 0) return;
									var count = Math.floor(width / 80);
									var countDes = Math.floor(measureSeries.values.length / count);
									var tickValues = [];
									for(var loc = 0 ; loc < measureSeries.values.length ; loc += countDes) {
										tickValues.push(measureSeries.values[loc].x);
									}
									_chart[axis + "Axis"].tickValues(tickValues);
								})();
							}
							_axis.tickFormat(function(d) {
								return _tickMultiFormat(app.time.offset(d).toDate(true));
							});
							break;
						case "number":
						/* falls through */
						default:
							_axis.tickFormat(d3.format(',r'));
					}
				}

				if(_chartType !== 'pie') {
					_defineLabelType("x", _config.xType || "number");
					_defineLabelType("y", _config.yType || "decimal");
				}

				// Global chart list update
				if(_preIndex === -1) {
					nvd3.charts.push(_chart);
				} else {
					nvd3.charts[_preIndex] = _chart;
				}

				// Use customize update function to update the view
				_chart.nvd3Update = function() {
					if(_config.xType === "time") _defineLabelType("x", _config.xType);
					_chart.update();
				};

				updateData();
			}

			// Update chart data
			function updateData() {
				var _min = null, _max = null;

				// Copy series to prevent Angular loop watching
				var _data = $.map($scope.nvd3 || [], function(series, i) {
					var _series = $.extend(true, {}, series);
					_series.color = _series.color || nvd3.colors[i % nvd3.colors.length];
					return _series;
				});

				// Chart Y value
				if(($scope.chart || _config.chart) !== "pie") {
					$.each(_data, function(i, series) {
						$.each(series.values, function(j, unit) {
							if(_min === null || unit.y < _min) _min = unit.y;
							if(_max === null || unit.y > _max) _max = unit.y;
						});
					});

					if(_min === 0 && _max === 0) {
						_chart.forceY([0, 10]);
					} else if(_config.yMin !== undefined || _config.yMax !== undefined) {
						_chart.forceY([_config.yMin, _config.yMax]);
					} else {
						_chart.forceY([]);
					}
				}

				// Update data
				d3.select(_chartCntr)						//Select the <svg> element you want to render the chart in.
					.datum(_data)							//Populate the <svg> element with chart data...
					.call(_chart);							//Finally, render the chart!

				setTimeout(_chart.nvd3Update, 10);
			}

			// ================================================================
			// =                           Watching                           =
			// ================================================================
			// Ignore initial checking
			$timeout(function() {
				if ($scope.watching !== "false") {
					$scope.$watch(function() {
						if(!$scope.nvd3) return [];

						var _hashList = $.map($scope.nvd3, function(series) {
							if(!series.values) return 0;
							var unit = {
								x: 0,
								y: 0
							};

							$.each(series.values, function(j, item) {
								unit.x += item.x;
								unit.y += item.y;
							});

							return unit;
						});

						return _hashList;
					}, function() {
						updateData();
					}, true);

					// All watching mode
					if ($scope.watching === "true") {
						$scope.$watch("[chart, config]", function(newValue, oldValue) {
							if(angular.equals(newValue, oldValue)) return;
							initChart();
						}, true);
					}
				}
			});

			// Holder inject
			_holder_updateTimes = 0;
			_holder = {
				element: $element,
				refresh: function() {
					setTimeout(function() {
						updateData();
					}, 0);
				},
				refreshAll: function() {
					setTimeout(function() {
						initChart();
					}, 0);
				}
			};

			Object.defineProperty(_holder, 'chart', {
				get: function() {return _chart;}
			});

			$scope.$watch("holder", function() {
				// Holder times update
				setTimeout(function() {
					_holder_updateTimes = 0;
				}, 0);
				_holder_updateTimes += 1;
				if(_holder_updateTimes > 100) throw "Holder conflict";

				$scope.holder = _holder;
			});

			// ================================================================
			// =                           Start Up                           =
			// ================================================================
			initChart();

			// ================================================================
			// =                           Clean Up                           =
			// ================================================================
			$scope.$on('$destroy', function() {
				destroy();
			});
		},
		template :
		'<div>' +
			'<h3 title="{{title || config.title}}">{{title || config.title}}</h3>' +
		'</div>',
		replace: true
	};
});