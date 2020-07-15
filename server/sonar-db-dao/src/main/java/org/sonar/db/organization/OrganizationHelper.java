/*
 * SonarQube
 * Copyright (C) 2009-2020 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.db.organization;

import java.util.List;
import java.util.stream.Collectors;
import org.sonar.db.DbClient;
import org.sonar.db.DbSession;
import org.sonar.db.permission.OrganizationPermission;

public class OrganizationHelper {

  private static final String ADMIN_PERMISSION = OrganizationPermission.ADMINISTER.getKey();

  private final DbClient dbClient;

  public OrganizationHelper(DbClient dbClient) {
    this.dbClient = dbClient;
  }

  public List<OrganizationDto> selectOrganizationsWithLastAdmin(DbSession dbSession, String userUuid) {
    return dbClient.organizationDao().selectByPermission(dbSession, userUuid, ADMIN_PERMISSION).stream()
      .filter(org -> isLastAdmin(dbSession, org, userUuid))
      .collect(Collectors.toList());
  }

  private boolean isLastAdmin(DbSession dbSession, OrganizationDto org, String userUuid) {
    return dbClient.authorizationDao().countUsersWithGlobalPermissionExcludingUser(dbSession, org.getUuid(), ADMIN_PERMISSION, userUuid) == 0;
  }
}
