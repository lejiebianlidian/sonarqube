CREATE TABLE "METRICS"(
    "ID" INTEGER NOT NULL,
    "UUID" VARCHAR(40) NOT NULL,
    "NAME" VARCHAR(64) NOT NULL,
    "DESCRIPTION" VARCHAR(255),
    "DIRECTION" INTEGER DEFAULT 0 NOT NULL,
    "DOMAIN" VARCHAR(64),
    "SHORT_NAME" VARCHAR(64),
    "QUALITATIVE" BOOLEAN DEFAULT FALSE NOT NULL,
    "VAL_TYPE" VARCHAR(8),
    "USER_MANAGED" BOOLEAN DEFAULT FALSE,
    "ENABLED" BOOLEAN DEFAULT TRUE,
    "WORST_VALUE" DOUBLE,
    "BEST_VALUE" DOUBLE,
    "OPTIMIZED_BEST_VALUE" BOOLEAN,
    "HIDDEN" BOOLEAN,
    "DELETE_HISTORICAL_DATA" BOOLEAN,
    "DECIMAL_SCALE" INTEGER
);
ALTER TABLE "METRICS" ADD CONSTRAINT "PK_METRICS" PRIMARY KEY("UUID");
CREATE UNIQUE INDEX "METRICS_UNIQUE_NAME" ON "METRICS"("NAME");
