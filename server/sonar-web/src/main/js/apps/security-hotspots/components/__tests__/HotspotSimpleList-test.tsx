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
import { mockRawHotspot } from '../../../../helpers/mocks/security-hotspots';
import { SecurityStandard } from '../../../../types/security';
import HotspotSimpleList, { HotspotSimpleListProps } from '../HotspotSimpleList';

it('should render correctly', () => {
  expect(shallowRender()).toMatchSnapshot();
});

function shallowRender(props: Partial<HotspotSimpleListProps> = {}) {
  const hotspots = [mockRawHotspot({ key: 'h1' }), mockRawHotspot({ key: 'h2' })];

  return shallow(
    <HotspotSimpleList
      filterByCategory={{ standard: SecurityStandard.OWASP_TOP10, category: 'a1' }}
      hotspots={hotspots}
      hotspotsTotal={2}
      loadingMore={false}
      onHotspotClick={jest.fn()}
      onLoadMore={jest.fn()}
      selectedHotspot={hotspots[0]}
      standards={{
        cwe: {},
        owaspTop10: {
          a1: { title: 'A1 - SQL Injection' },
          a3: { title: 'A3 - Sensitive Data Exposure' }
        },
        sansTop25: {},
        sonarsourceSecurity: {}
      }}
      {...props}
    />
  );
}
