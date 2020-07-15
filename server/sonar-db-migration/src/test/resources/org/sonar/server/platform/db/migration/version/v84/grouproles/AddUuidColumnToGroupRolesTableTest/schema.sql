CREATE TABLE "GROUP_ROLES"(
    "ID" INTEGER NOT NULL,
    "ORGANIZATION_UUID" VARCHAR(40) NOT NULL,
    "GROUP_ID" INTEGER,
    "ROLE" VARCHAR(64) NOT NULL,
    "COMPONENT_UUID" VARCHAR(40)
);
ALTER TABLE "GROUP_ROLES" ADD CONSTRAINT "PK_GROUP_ROLES" PRIMARY KEY("ID");
CREATE INDEX "GROUP_ROLES_COMPONENT_UUID" ON "GROUP_ROLES"("COMPONENT_UUID");
CREATE UNIQUE INDEX "UNIQ_GROUP_ROLES" ON "GROUP_ROLES"("ORGANIZATION_UUID", "GROUP_ID", "COMPONENT_UUID", "ROLE");
