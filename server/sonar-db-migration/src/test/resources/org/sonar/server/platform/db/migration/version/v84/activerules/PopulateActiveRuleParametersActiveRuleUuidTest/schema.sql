CREATE TABLE "ACTIVE_RULE_PARAMETERS"(
    "ACTIVE_RULE_ID" INTEGER NOT NULL,
    "ACTIVE_RULE_UUID" VARCHAR(40),
    "RULES_PARAMETER_ID" INTEGER NOT NULL,
    "VALUE" VARCHAR(4000),
    "RULES_PARAMETER_KEY" VARCHAR(128),
    "UUID" VARCHAR(40) NOT NULL
);
ALTER TABLE "ACTIVE_RULE_PARAMETERS" ADD CONSTRAINT "PK_ACTIVE_RULE_PARAMETERS" PRIMARY KEY("UUID");
CREATE INDEX "IX_ARP_ON_ACTIVE_RULE_ID" ON "ACTIVE_RULE_PARAMETERS"("ACTIVE_RULE_ID");

CREATE TABLE "ACTIVE_RULES"(
    "ID" INTEGER NOT NULL AUTO_INCREMENT (1,1),
    "UUID" VARCHAR(40) NOT NULL,
    "PROFILE_ID" INTEGER NOT NULL,
    "RULE_ID" INTEGER NOT NULL,
    "FAILURE_LEVEL" INTEGER NOT NULL,
    "INHERITANCE" VARCHAR(10),
    "CREATED_AT" BIGINT,
    "UPDATED_AT" BIGINT
);
ALTER TABLE "ACTIVE_RULES" ADD CONSTRAINT "PK_ACTIVE_RULES" PRIMARY KEY("ID");
CREATE UNIQUE INDEX "UNIQ_PROFILE_RULE_IDS" ON "ACTIVE_RULES"("PROFILE_ID", "RULE_ID");
