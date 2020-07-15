CREATE TABLE "PROPERTIES"(
    "ID" INTEGER NOT NULL,
    "UUID" VARCHAR(40) NOT NULL,
    "PROP_KEY" VARCHAR(512) NOT NULL,
    "RESOURCE_ID" BIGINT,
    "USER_ID" BIGINT,
    "IS_EMPTY" BOOLEAN NOT NULL,
    "TEXT_VALUE" VARCHAR(4000),
    "CLOB_VALUE" CLOB(2147483647),
    "CREATED_AT" BIGINT NOT NULL
);
CREATE INDEX "PROPERTIES_KEY" ON "PROPERTIES"("PROP_KEY");
