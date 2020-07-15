CREATE TABLE "RULES"(
    "ID" INTEGER NOT NULL AUTO_INCREMENT (1,1),
    "NAME" VARCHAR(200),
    "PLUGIN_RULE_KEY" VARCHAR(200) NOT NULL,
    "PLUGIN_KEY" VARCHAR(200),
    "PLUGIN_CONFIG_KEY" VARCHAR(200),
    "PLUGIN_NAME" VARCHAR(255) NOT NULL,
    "SCOPE" VARCHAR(20) NOT NULL,
    "DESCRIPTION" CLOB(2147483647),
    "PRIORITY" INTEGER,
    "STATUS" VARCHAR(40),
    "LANGUAGE" VARCHAR(20),
    "DEF_REMEDIATION_FUNCTION" VARCHAR(20),
    "DEF_REMEDIATION_GAP_MULT" VARCHAR(20),
    "DEF_REMEDIATION_BASE_EFFORT" VARCHAR(20),
    "GAP_DESCRIPTION" VARCHAR(4000),
    "SYSTEM_TAGS" VARCHAR(4000),
    "IS_TEMPLATE" BOOLEAN DEFAULT FALSE NOT NULL,
    "DESCRIPTION_FORMAT" VARCHAR(20),
    "RULE_TYPE" TINYINT,
    "SECURITY_STANDARDS" VARCHAR(4000),
    "IS_AD_HOC" BOOLEAN NOT NULL,
    "IS_EXTERNAL" BOOLEAN NOT NULL,
    "CREATED_AT" BIGINT,
    "UPDATED_AT" BIGINT,
    "UUID" VARCHAR(40) NOT NULL,
    "TEMPLATE_UUID" VARCHAR(40)
);
ALTER TABLE "RULES" ADD CONSTRAINT "PK_RULES" PRIMARY KEY("ID");
CREATE UNIQUE INDEX "RULES_REPO_KEY" ON "RULES"("PLUGIN_RULE_KEY", "PLUGIN_NAME");

CREATE TABLE "RULES_METADATA"(
    "RULE_ID" INTEGER NOT NULL,
    "ORGANIZATION_UUID" VARCHAR(40) NOT NULL,
    "NOTE_DATA" CLOB(2147483647),
    "NOTE_USER_UUID" VARCHAR(255),
    "NOTE_CREATED_AT" BIGINT,
    "NOTE_UPDATED_AT" BIGINT,
    "REMEDIATION_FUNCTION" VARCHAR(20),
    "REMEDIATION_GAP_MULT" VARCHAR(20),
    "REMEDIATION_BASE_EFFORT" VARCHAR(20),
    "TAGS" VARCHAR(4000),
    "AD_HOC_NAME" VARCHAR(200),
    "AD_HOC_DESCRIPTION" CLOB(2147483647),
    "AD_HOC_SEVERITY" VARCHAR(10),
    "AD_HOC_TYPE" TINYINT,
    "CREATED_AT" BIGINT NOT NULL,
    "UPDATED_AT" BIGINT NOT NULL,
    "RULE_UUID" VARCHAR(40) NOT NULL
);
ALTER TABLE "RULES_METADATA" ADD CONSTRAINT "PK_RULES_METADATA" PRIMARY KEY("RULE_ID", "ORGANIZATION_UUID");
