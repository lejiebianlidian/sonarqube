CREATE TABLE "LIVE_MEASURES"(
    "UUID" VARCHAR(40) NOT NULL,
    "PROJECT_UUID" VARCHAR(50) NOT NULL,
    "COMPONENT_UUID" VARCHAR(50) NOT NULL,
    "METRIC_ID" INTEGER NOT NULL,
    "VALUE" DOUBLE,
    "TEXT_VALUE" VARCHAR(4000),
    "VARIATION" DOUBLE,
    "MEASURE_DATA" BLOB,
    "UPDATE_MARKER" VARCHAR(40),
    "CREATED_AT" BIGINT NOT NULL,
    "UPDATED_AT" BIGINT NOT NULL
);
ALTER TABLE "LIVE_MEASURES" ADD CONSTRAINT "PK_LIVE_MEASURES" PRIMARY KEY("UUID");
CREATE INDEX "LIVE_MEASURES_PROJECT" ON "LIVE_MEASURES"("PROJECT_UUID");
CREATE UNIQUE INDEX "LIVE_MEASURES_COMPONENT" ON "LIVE_MEASURES"("COMPONENT_UUID", "METRIC_ID");

CREATE TABLE "LIVE_MEASURES_COPY"(
    "UUID" VARCHAR(40) NOT NULL,
    "PROJECT_UUID" VARCHAR(50) NOT NULL,
    "COMPONENT_UUID" VARCHAR(50) NOT NULL,
    "METRIC_UUID" VARCHAR(40) NOT NULL,
    "VALUE" DOUBLE,
    "TEXT_VALUE" VARCHAR(4000),
    "VARIATION" DOUBLE,
    "MEASURE_DATA" BLOB,
    "UPDATE_MARKER" VARCHAR(40),
    "CREATED_AT" BIGINT NOT NULL,
    "UPDATED_AT" BIGINT NOT NULL
);
