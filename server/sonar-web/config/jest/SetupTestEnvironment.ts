/*
 * SonarQube
 * Copyright (C) 2009-2021 SonarSource SA
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
import ThemeContext from 'sonar-ui-common/components/theme';
import SonarUiCommonInitializer, { DEFAULT_LOCALE } from 'sonar-ui-common/helpers/init';
import * as theme from '../../src/main/js/app/theme';

const content = document.createElement('div');
content.id = 'content';
document.documentElement.appendChild(content);

const baseUrl = '';
(window as any).baseUrl = baseUrl;
SonarUiCommonInitializer.setLocale(DEFAULT_LOCALE)
  .setMessages({})
  .setUrlContext(baseUrl);

// Hack : override the default value of the context used for theme by emotion
// This allows tests to get the theme value without specifiying a theme provider
ThemeContext['_currentValue'] = theme;
ThemeContext['_currentValue2'] = theme;
