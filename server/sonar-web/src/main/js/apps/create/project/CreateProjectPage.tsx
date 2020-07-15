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
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { WithRouterProps } from 'react-router';
import { translate } from 'sonar-ui-common/helpers/l10n';
import { getAlmSettings } from '../../../api/alm-settings';
import A11ySkipTarget from '../../../app/components/a11y/A11ySkipTarget';
import { whenLoggedIn } from '../../../components/hoc/whenLoggedIn';
import { withAppState } from '../../../components/hoc/withAppState';
import { getProjectUrl } from '../../../helpers/urls';
import { AlmKeys, AlmSettingsInstance } from '../../../types/alm-settings';
import BitbucketProjectCreate from './BitbucketProjectCreate';
import CreateProjectModeSelection from './CreateProjectModeSelection';
import GitHubProjectCreate from './GitHubProjectCreate';
import ManualProjectCreate from './ManualProjectCreate';
import './style.css';
import { CreateProjectModes } from './types';

interface Props extends Pick<WithRouterProps, 'router' | 'location'> {
  appState: Pick<T.AppState, 'branchesEnabled' | 'canAdmin'>;
  currentUser: T.LoggedInUser;
}

interface State {
  bitbucketSettings: AlmSettingsInstance[];
  githubSettings: AlmSettingsInstance[];
  loading: boolean;
}

export class CreateProjectPage extends React.PureComponent<Props, State> {
  mounted = false;
  state: State = { bitbucketSettings: [], githubSettings: [], loading: true };

  componentDidMount() {
    const {
      appState: { branchesEnabled }
    } = this.props;
    this.mounted = true;
    if (branchesEnabled) {
      this.fetchAlmBindings();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchAlmBindings = () => {
    this.setState({ loading: true });
    getAlmSettings()
      .then(almSettings => {
        if (this.mounted) {
          this.setState({
            bitbucketSettings: almSettings.filter(s => s.alm === AlmKeys.Bitbucket),
            githubSettings: almSettings.filter(s => s.alm === AlmKeys.GitHub),
            loading: false
          });
        }
      })
      .catch(() => {
        if (this.mounted) {
          this.setState({ loading: false });
        }
      });
  };

  handleModeSelect = (mode: CreateProjectModes) => {
    const { router, location } = this.props;
    router.push({
      pathname: location.pathname,
      query: { mode }
    });
  };

  handleProjectCreate = (projectKeys: string[]) => {
    if (projectKeys.length === 1) {
      this.props.router.push(getProjectUrl(projectKeys[0]));
    }
  };

  renderForm(mode?: CreateProjectModes) {
    const {
      appState: { canAdmin },
      location,
      router
    } = this.props;
    const { bitbucketSettings, githubSettings, loading } = this.state;

    switch (mode) {
      case CreateProjectModes.BitbucketServer: {
        return (
          <BitbucketProjectCreate
            canAdmin={!!canAdmin}
            bitbucketSettings={bitbucketSettings}
            loadingBindings={loading}
            location={location}
            onProjectCreate={this.handleProjectCreate}
          />
        );
      }
      case CreateProjectModes.GitHub: {
        return (
          <GitHubProjectCreate
            canAdmin={!!canAdmin}
            loadingBindings={loading}
            location={location}
            onProjectCreate={this.handleProjectCreate}
            router={router}
            settings={githubSettings}
          />
        );
      }
      case CreateProjectModes.Manual: {
        return <ManualProjectCreate onProjectCreate={this.handleProjectCreate} />;
      }
      default: {
        const almCounts = {
          [AlmKeys.Azure]: 0,
          [AlmKeys.Bitbucket]: bitbucketSettings.length,
          [AlmKeys.GitHub]: githubSettings.length,
          [AlmKeys.GitLab]: 0
        };
        return (
          <CreateProjectModeSelection
            almCounts={almCounts}
            loadingBindings={loading}
            onSelectMode={this.handleModeSelect}
          />
        );
      }
    }
  }

  render() {
    const {
      appState: { branchesEnabled },
      location
    } = this.props;
    const mode: CreateProjectModes | undefined = location.query?.mode;

    return (
      <>
        <Helmet title={translate('my_account.create_new.TRK')} titleTemplate="%s" />
        <A11ySkipTarget anchor="create_project_main" />
        <div className="page page-limited huge-spacer-bottom position-relative" id="create-project">
          {this.renderForm(branchesEnabled ? mode : CreateProjectModes.Manual)}
        </div>
      </>
    );
  }
}

export default whenLoggedIn(withAppState(CreateProjectPage));
