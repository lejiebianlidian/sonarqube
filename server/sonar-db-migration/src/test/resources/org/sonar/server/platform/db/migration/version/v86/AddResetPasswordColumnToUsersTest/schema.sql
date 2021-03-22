CREATE TABLE "USERS"(
    "UUID" VARCHAR(255) NOT NULL,
    "LOGIN" VARCHAR(255) NOT NULL,
    "NAME" VARCHAR(200),
    "EMAIL" VARCHAR(100),
    "CRYPTED_PASSWORD" VARCHAR(100),
    "SALT" VARCHAR(40),
    "HASH_METHOD" VARCHAR(10),
    "ACTIVE" BOOLEAN DEFAULT TRUE,
    "SCM_ACCOUNTS" VARCHAR(4000),
    "EXTERNAL_LOGIN" VARCHAR(255) NOT NULL,
    "EXTERNAL_IDENTITY_PROVIDER" VARCHAR(100) NOT NULL,
    "EXTERNAL_ID" VARCHAR(255) NOT NULL,
    "IS_ROOT" BOOLEAN NOT NULL,
    "USER_LOCAL" BOOLEAN,
    "ONBOARDED" BOOLEAN NOT NULL,
    "HOMEPAGE_TYPE" VARCHAR(40),
    "HOMEPAGE_PARAMETER" VARCHAR(40),
    "LAST_CONNECTION_DATE" BIGINT,
    "CREATED_AT" BIGINT,
    "UPDATED_AT" BIGINT
);
ALTER TABLE "USERS" ADD CONSTRAINT "PK_USERS" PRIMARY KEY("UUID");
CREATE UNIQUE INDEX "USERS_LOGIN" ON "USERS"("LOGIN");
CREATE INDEX "USERS_UPDATED_AT" ON "USERS"("UPDATED_AT");
CREATE UNIQUE INDEX "UNIQ_EXTERNAL_ID" ON "USERS"("EXTERNAL_IDENTITY_PROVIDER", "EXTERNAL_ID");
CREATE UNIQUE INDEX "UNIQ_EXTERNAL_LOGIN" ON "USERS"("EXTERNAL_IDENTITY_PROVIDER", "EXTERNAL_LOGIN");

