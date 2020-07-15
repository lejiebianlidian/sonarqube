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
import { get, getJSON, post, postJSON } from 'sonar-ui-common/helpers/request';
import throwGlobalError from '../app/utils/throwGlobalError';
import {
  BitbucketProject,
  BitbucketRepository,
  GithubOrganization,
  GithubRepository
} from '../types/alm-integration';
import { ProjectBase } from './components';

export function setAlmPersonalAccessToken(almSetting: string, pat: string): Promise<void> {
  return post('/api/alm_integrations/set_pat', { almSetting, pat }).catch(throwGlobalError);
}

export function checkPersonalAccessTokenIsValid(almSetting: string): Promise<boolean> {
  return get('/api/alm_integrations/check_pat', { almSetting })
    .then(() => true)
    .catch((response: Response) => {
      if (response.status === 400) {
        return false;
      } else {
        return throwGlobalError(response);
      }
    });
}

export function getBitbucketServerProjects(
  almSetting: string
): Promise<{ projects: BitbucketProject[] }> {
  return getJSON('/api/alm_integrations/list_bitbucketserver_projects', { almSetting });
}

export function getBitbucketServerRepositories(
  almSetting: string,
  projectName: string
): Promise<{
  isLastPage: boolean;
  repositories: BitbucketRepository[];
}> {
  return getJSON('/api/alm_integrations/search_bitbucketserver_repos', {
    almSetting,
    projectName
  });
}

export function importBitbucketServerProject(
  almSetting: string,
  projectKey: string,
  repositorySlug: string
): Promise<{ project: ProjectBase }> {
  return postJSON('/api/alm_integrations/import_bitbucketserver_project', {
    almSetting,
    projectKey,
    repositorySlug
  }).catch(throwGlobalError);
}

export function searchForBitbucketServerRepositories(
  almSetting: string,
  repositoryName: string
): Promise<{
  isLastPage: boolean;
  repositories: BitbucketRepository[];
}> {
  return getJSON('/api/alm_integrations/search_bitbucketserver_repos', {
    almSetting,
    repositoryName
  });
}

export function getGithubClientId(almSetting: string): Promise<{ clientId?: string }> {
  return getJSON('/api/alm_integrations/get_github_client_id', { almSetting });
}

export function importGithubRepository(
  almSetting: string,
  organization: string,
  repositoryKey: string
): Promise<{ project: ProjectBase }> {
  return postJSON('/api/alm_integrations/import_github_project', {
    almSetting,
    organization,
    repositoryKey
  }).catch(throwGlobalError);
}

export function getGithubOrganizations(
  almSetting: string,
  token: string
): Promise<{ organizations: GithubOrganization[] }> {
  return getJSON('/api/alm_integrations/list_github_organizations', {
    almSetting,
    token
  }).catch((response?: Response) => {
    if (response && response.status !== 400) {
      throwGlobalError(response);
    }
  });
}

export function getGithubRepositories(data: {
  almSetting: string;
  organization: string;
  ps: number;
  p?: number;
  query?: string;
}): Promise<{ repositories: GithubRepository[]; paging: T.Paging }> {
  const { almSetting, organization, ps, p = 1, query } = data;
  return getJSON('/api/alm_integrations/list_github_repositories', {
    almSetting,
    organization,
    p,
    ps,
    q: query || undefined
  }).catch(throwGlobalError);
}
