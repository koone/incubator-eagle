/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.eagle.alert.engine.coordinator;

import org.apache.commons.lang3.builder.HashCodeBuilder;

public class AlertDefinition {
    private TemplateType templateType = TemplateType.TEXT;
    private String subject;
    private String body;

    private AlertSeverity severity;
    private String category;

    public String getBody() {
        return body;
    }

    public void setBody(String templateResource) {
        this.body = templateResource;
    }

    public TemplateType getTemplateType() {
        return templateType;
    }

    public void setTemplateType(TemplateType type) {
        this.templateType = type;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public AlertSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(AlertSeverity severity) {
        this.severity = severity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public enum TemplateType {
        TEXT,
        // FILE,
        // HTTP
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder()
                .append(templateType)
                .append(this.body)
                .append(this.category)
                .append(this.severity)
                .append(this.subject)
                .build();
    }

    @Override
    public boolean equals(Object that) {
        if (that == this) {
            return true;
        }
        if (!(that instanceof AlertDefinition)) {
            return false;
        }
        AlertDefinition another = (AlertDefinition) that;
        if (another.templateType.equals(this.templateType)
                && another.body.equals(this.body)
                && another.category.equals(this.category)
                && another.severity.equals(this.severity)
                && another.subject.equals(this.subject)) {
            return true;
        }
        return false;
    }
}