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
import { shallow } from 'enzyme';
import * as React from 'react';
import { ComponentQualifier } from '../../../../types/component';
import TaskComponent from '../TaskComponent';

it('renders correctly', () => {
  expect(shallowRender()).toMatchSnapshot();
  expect(shallowRender({ componentKey: undefined })).toMatchSnapshot('undefined key');
  expect(shallowRender({ componentQualifier: ComponentQualifier.Portfolio })).toMatchSnapshot(
    'portfolio'
  );
  expect(shallowRender({ branch: 'feature' })).toMatchSnapshot('branch');
  expect(shallowRender({ branch: 'branch-6.7' })).toMatchSnapshot('branch');
  expect(shallowRender({ pullRequest: 'pr-89' })).toMatchSnapshot('pull request');
});

function shallowRender(taskOverrides: Partial<T.Task> = {}) {
  const TASK = {
    componentKey: 'foo',
    componentName: 'foo',
    componentQualifier: 'TRK',
    id: 'bar',
    organization: 'org',
    status: 'PENDING',
    submittedAt: '2017-01-01',
    submitterLogin: 'yoda',
    type: 'REPORT'
  };
  return shallow(<TaskComponent task={{ ...TASK, ...taskOverrides }} />);
}
