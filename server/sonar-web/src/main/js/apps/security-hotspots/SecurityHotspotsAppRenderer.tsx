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
import DeferredSpinner from 'sonar-ui-common/components/ui/DeferredSpinner';
import { translate } from 'sonar-ui-common/helpers/l10n';
import { scrollToElement } from 'sonar-ui-common/helpers/scrolling';
import A11ySkipTarget from '../../app/components/a11y/A11ySkipTarget';
import Suggestions from '../../app/components/embed-docs-modal/Suggestions';
import ScreenPositionHelper from '../../components/common/ScreenPositionHelper';
import { isBranch } from '../../helpers/branch-like';
import { BranchLike } from '../../types/branch-like';
import { HotspotFilters, HotspotStatusFilter, RawHotspot } from '../../types/security-hotspots';
import EmptyHotspotsPage from './components/EmptyHotspotsPage';
import FilterBar from './components/FilterBar';
import HotspotList from './components/HotspotList';
import HotspotViewer from './components/HotspotViewer';
import './styles.css';

export interface SecurityHotspotsAppRendererProps {
  branchLike?: BranchLike;
  component: T.Component;
  filters: HotspotFilters;
  hotspots: RawHotspot[];
  hotspotsReviewedMeasure?: string;
  hotspotsTotal: number;
  isStaticListOfHotspots: boolean;
  loading: boolean;
  loadingMeasure: boolean;
  loadingMore: boolean;
  onChangeFilters: (filters: Partial<HotspotFilters>) => void;
  onHotspotClick: (hotspot: RawHotspot) => void;
  onLoadMore: () => void;
  onShowAllHotspots: () => void;
  onUpdateHotspot: (hotspotKey: string) => Promise<void>;
  selectedHotspot: RawHotspot | undefined;
  securityCategories: T.StandardSecurityCategories;
}

export default function SecurityHotspotsAppRenderer(props: SecurityHotspotsAppRendererProps) {
  const {
    branchLike,
    component,
    hotspots,
    hotspotsReviewedMeasure,
    hotspotsTotal,
    isStaticListOfHotspots,
    loading,
    loadingMeasure,
    loadingMore,
    securityCategories,
    selectedHotspot,
    filters
  } = props;

  const scrollableRef = React.useRef(null);

  React.useEffect(() => {
    const parent = scrollableRef.current;
    const element =
      selectedHotspot && document.querySelector(`[data-hotspot-key="${selectedHotspot.key}"]`);
    if (parent && element) {
      scrollToElement(element, { parent, smooth: true, topOffset: 150, bottomOffset: 400 });
    }
  }, [selectedHotspot]);

  return (
    <div id="security_hotspots">
      <Suggestions suggestions="security_hotspots" />
      <Helmet title={translate('hotspots.page')} />
      <A11ySkipTarget anchor="security_hotspots_main" />

      <FilterBar
        component={component}
        filters={filters}
        hotspotsReviewedMeasure={hotspotsReviewedMeasure}
        isStaticListOfHotspots={isStaticListOfHotspots}
        loadingMeasure={loadingMeasure}
        onBranch={isBranch(branchLike)}
        onChangeFilters={props.onChangeFilters}
        onShowAllHotspots={props.onShowAllHotspots}
      />

      {loading && <DeferredSpinner className="huge-spacer-left big-spacer-top" />}

      {!loading &&
        (hotspots.length === 0 || !selectedHotspot ? (
          <EmptyHotspotsPage
            filtered={
              filters.assignedToMe ||
              (isBranch(branchLike) && filters.sinceLeakPeriod) ||
              filters.status !== HotspotStatusFilter.TO_REVIEW
            }
            isStaticListOfHotspots={isStaticListOfHotspots}
          />
        ) : (
          <div className="layout-page">
            <ScreenPositionHelper className="layout-page-side-outer">
              {({ top }) => (
                <div className="layout-page-side" ref={scrollableRef} style={{ top }}>
                  <div className="layout-page-side-inner">
                    <HotspotList
                      hotspots={hotspots}
                      hotspotsTotal={hotspotsTotal}
                      isStaticListOfHotspots={isStaticListOfHotspots}
                      loadingMore={loadingMore}
                      onHotspotClick={props.onHotspotClick}
                      onLoadMore={props.onLoadMore}
                      securityCategories={securityCategories}
                      selectedHotspot={selectedHotspot}
                      statusFilter={filters.status}
                    />
                  </div>
                </div>
              )}
            </ScreenPositionHelper>

            <div className="layout-page-main">
              <HotspotViewer
                branchLike={branchLike}
                component={component}
                hotspotKey={selectedHotspot.key}
                onUpdateHotspot={props.onUpdateHotspot}
                securityCategories={securityCategories}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
