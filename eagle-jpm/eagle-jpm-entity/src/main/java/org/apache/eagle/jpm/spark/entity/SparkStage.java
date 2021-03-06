/*
 *  Licensed to the Apache Software Foundation (ASF) under one
 *  or more contributor license agreements.  See the NOTICE file
 *  distributed with this work for additional information
 *  regarding copyright ownership.  The ASF licenses this file
 *  to you under the Apache License, Version 2.0 (the
 *  "License"); you may not use this file except in compliance
 *  with the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.apache.eagle.jpm.spark.entity;

import org.apache.eagle.jpm.util.Constants;
import org.apache.eagle.log.base.taggedlog.TaggedLogAPIEntity;
import org.apache.eagle.log.entity.meta.*;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Table("eglesprk_stages")
@ColumnFamily("f")
@Prefix("sprkstage")
@Service(Constants.SPARK_STAGE_SERVICE_ENDPOINT_NAME)
@JsonIgnoreProperties(ignoreUnknown = true)
@TimeSeries(true)
@Tags({"site","sprkAppId", "sprkAppAttemptId", "sprkAppName", "normSprkAppName", "jobId", "stageId","stageAttemptId","user", "queue"})
@Partition({"site"})
public class SparkStage extends TaggedLogAPIEntity {

    @Column("a")
    private String status;
    @Column("b")
    private int numActiveTasks = 0;
    @Column("c")
    private int numCompletedTasks = 0;
    @Column("d")
    private int numFailedTasks = 0;
    @Column("e")
    private long executorRunTime = 0L;
    @Column("f")
    private long inputBytes = 0L;
    @Column("g")
    private long inputRecords = 0L;
    @Column("h")
    private long outputBytes = 0L;
    @Column("i")
    private long outputRecords = 0L;
    @Column("j")
    private long shuffleReadBytes = 0L;
    @Column("k")
    private long shuffleReadRecords = 0L;
    @Column("l")
    private long shuffleWriteBytes = 0L;
    @Column("m")
    private long shuffleWriteRecords = 0L;
    @Column("n")
    private long memoryBytesSpilled = 0L;
    @Column("o")
    private long diskBytesSpilled = 0L;
    @Column("p")
    private String name;
    @Column("q")
    private String schedulingPool;
    @Column("r")
    private long submitTime;
    @Column("s")
    private long completeTime;
    @Column("t")
    private int numTasks;
    @Column("u")
    private long executorDeserializeTime;
    @Column("v")
    private long resultSize;
    @Column("w")
    private long jvmGcTime;
    @Column("x")
    private long resultSerializationTime;

    public String getStatus() {
        return status;
    }

    public int getNumActiveTasks() {
        return numActiveTasks;
    }

    public int getNumCompletedTasks() {
        return numCompletedTasks;
    }

    public int getNumFailedTasks() {
        return numFailedTasks;
    }

    public long getExecutorRunTime() {
        return executorRunTime;
    }

    public long getInputBytes() {
        return inputBytes;
    }

    public long getInputRecords() {
        return inputRecords;
    }

    public long getOutputBytes() {
        return outputBytes;
    }

    public long getOutputRecords() {
        return outputRecords;
    }

    public long getShuffleReadBytes() {
        return shuffleReadBytes;
    }

    public long getShuffleReadRecords() {
        return shuffleReadRecords;
    }

    public long getShuffleWriteBytes() {
        return shuffleWriteBytes;
    }

    public long getShuffleWriteRecords() {
        return shuffleWriteRecords;
    }

    public long getMemoryBytesSpilled() {
        return memoryBytesSpilled;
    }

    public long getDiskBytesSpilled() {
        return diskBytesSpilled;
    }

    public String getName() {
        return name;
    }

    public String getSchedulingPool() {
        return schedulingPool;
    }

    public long getSubmitTime() {
        return submitTime;
    }

    public long getCompleteTime() {
        return completeTime;
    }

    public int getNumTasks() {
        return numTasks;
    }

    public long getExecutorDeserializeTime() {
        return executorDeserializeTime;
    }

    public long getResultSize() {
        return resultSize;
    }

    public long getJvmGcTime() {
        return jvmGcTime;
    }

    public long getResultSerializationTime() {
        return resultSerializationTime;
    }

    public void setStatus(String status) {
        this.status = status;
        this.valueChanged("status");
    }

    public void setNumActiveTasks(int numActiveTasks) {
        this.numActiveTasks = numActiveTasks;
        this.valueChanged("numActiveTasks");
    }

    public void setNumCompletedTasks(int numCompletedTasks) {
        this.numCompletedTasks = numCompletedTasks;
        this.valueChanged("numCompletedTasks");
    }

    public void setNumFailedTasks(int numFailedTasks) {
        this.numFailedTasks = numFailedTasks;
        this.valueChanged("numFailedTasks");
    }

    public void setExecutorRunTime(long executorRunTime) {
        this.executorRunTime = executorRunTime;
        this.valueChanged("executorRunTime");
    }

    public void setInputBytes(long inputBytes) {
        this.inputBytes = inputBytes;
        this.valueChanged("inputBytes");
    }

    public void setInputRecords(long inputRecords) {
        this.inputRecords = inputRecords;
        this.valueChanged("inputRecords");
    }

    public void setOutputBytes(long outputBytes) {
        this.outputBytes = outputBytes;
        this.valueChanged("outputBytes");
    }

    public void setOutputRecords(long outputRecords) {
        this.outputRecords = outputRecords;
        this.valueChanged("outputRecords");
    }

    public void setShuffleReadBytes(long shuffleReadBytes) {
        this.shuffleReadBytes = shuffleReadBytes;
        this.valueChanged("shuffleReadBytes");
    }

    public void setShuffleReadRecords(long shuffleReadRecords) {
        this.shuffleReadRecords = shuffleReadRecords;
        this.valueChanged("shuffleReadRecords");
    }

    public void setShuffleWriteBytes(long shuffleWriteBytes) {
        this.shuffleWriteBytes = shuffleWriteBytes;
        this.valueChanged("shuffleWriteBytes");
    }

    public void setShuffleWriteRecords(long shuffleWriteRecords) {
        this.shuffleWriteRecords = shuffleWriteRecords;
        this.valueChanged("shuffleWriteRecords");
    }

    public void setMemoryBytesSpilled(long memoryBytesSpilled) {
        this.memoryBytesSpilled = memoryBytesSpilled;
        this.valueChanged("memoryBytesSpilled");
    }

    public void setDiskBytesSpilled(long diskBytesSpilled) {
        this.diskBytesSpilled = diskBytesSpilled;
        this.valueChanged("diskBytesSpilled");
    }

    public void setName(String name) {
        this.name = name;
        this.valueChanged("name");
    }

    public void setSchedulingPool(String schedulingPool) {
        this.schedulingPool = schedulingPool;
        this.valueChanged("schedulingPool");
    }

    public void setSubmitTime(long submitTime) {
        this.submitTime = submitTime;
        this.valueChanged("submitTime");
    }

    public void setCompleteTime(long completeTime) {
        this.completeTime = completeTime;
        this.valueChanged("completeTime");
    }

    public void setNumTasks(int numTasks) {
        this.numTasks = numTasks;
        valueChanged("numTasks");
    }

    public void setExecutorDeserializeTime(long executorDeserializeTime) {
        this.executorDeserializeTime = executorDeserializeTime;
        valueChanged("executorDeserializeTime");
    }

    public void setResultSize(long resultSize) {
        this.resultSize = resultSize;
        valueChanged("resultSize");
    }

    public void setJvmGcTime(long jvmGcTime) {
        this.jvmGcTime = jvmGcTime;
        valueChanged("jvmGcTime");
    }

    public void setResultSerializationTime(long resultSerializationTime) {
        this.resultSerializationTime = resultSerializationTime;
        valueChanged("resultSerializationTime");
    }
}
