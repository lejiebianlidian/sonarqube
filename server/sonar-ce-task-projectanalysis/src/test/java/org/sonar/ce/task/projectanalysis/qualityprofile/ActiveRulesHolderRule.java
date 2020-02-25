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
package org.sonar.ce.task.projectanalysis.qualityprofile;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.junit.rules.ExternalResource;
import org.sonar.api.rule.RuleKey;

public class ActiveRulesHolderRule extends ExternalResource implements ActiveRulesHolder {

  private final Map<RuleKey, ActiveRule> activeRulesByKey = new HashMap<>();

  @Override
  public Optional<ActiveRule> get(RuleKey ruleKey) {
    return Optional.ofNullable(activeRulesByKey.get(ruleKey));
  }

  public ActiveRulesHolderRule put(ActiveRule activeRule) {
    activeRulesByKey.put(activeRule.getRuleKey(), activeRule);
    return this;
  }

  @Override
  protected void after() {
    activeRulesByKey.clear();
  }
}
