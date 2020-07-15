CREATE TABLE "USER_TOKENS"(
    "ID" INTEGER NOT NULL,
    "UUID" VARCHAR(40) NOT NULL,
    "USER_UUID" VARCHAR(255) NOT NULL,
    "NAME" VARCHAR(100) NOT NULL,
    "TOKEN_HASH" VARCHAR(255) NOT NULL,
    "LAST_CONNECTION_DATE" BIGINT,
    "CREATED_AT" BIGINT NOT NULL
);
CREATE UNIQUE INDEX "USER_TOKENS_USER_UUID_NAME" ON "USER_TOKENS"("USER_UUID", "NAME");
CREATE UNIQUE INDEX "USER_TOKENS_TOKEN_HASH" ON "USER_TOKENS"("TOKEN_HASH");
