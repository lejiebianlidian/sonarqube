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
package org.sonar.ce.task.projectanalysis.step;

import com.google.common.base.Joiner;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.sonar.api.utils.MessageException;
import org.sonar.api.utils.System2;
import org.sonar.ce.task.log.CeTaskMessages;
import org.sonar.ce.task.projectanalysis.analysis.AnalysisMetadataHolder;
import org.sonar.ce.task.projectanalysis.component.Component;
import org.sonar.ce.task.projectanalysis.component.ComponentVisitor;
import org.sonar.ce.task.projectanalysis.component.CrawlerDepthLimit;
import org.sonar.ce.task.projectanalysis.component.DepthTraversalTypeAwareCrawler;
import org.sonar.ce.task.projectanalysis.component.TreeRootHolder;
import org.sonar.ce.task.projectanalysis.component.TypeAwareVisitorAdapter;
import org.sonar.ce.task.step.ComputationStep;
import org.sonar.db.DbClient;
import org.sonar.db.DbSession;
import org.sonar.db.component.BranchDto;
import org.sonar.db.component.ComponentDao;
import org.sonar.db.component.ComponentDto;
import org.sonar.db.component.SnapshotDto;

import static com.google.common.base.Preconditions.checkState;
import static java.lang.String.format;
import static org.sonar.api.utils.DateUtils.formatDateTime;
import static org.sonar.core.component.ComponentKeys.ALLOWED_CHARACTERS_MESSAGE;
import static org.sonar.core.component.ComponentKeys.isValidProjectKey;

public class ValidateProjectStep implements ComputationStep {

  private static final Joiner MESSAGES_JOINER = Joiner.on("\n  o ");

  private final DbClient dbClient;
  private final TreeRootHolder treeRootHolder;
  private final AnalysisMetadataHolder analysisMetadataHolder;
  private final CeTaskMessages taskMessages;
  private final System2 system2;

  public ValidateProjectStep(DbClient dbClient, TreeRootHolder treeRootHolder, AnalysisMetadataHolder analysisMetadataHolder, CeTaskMessages taskMessages, System2 system2) {
    this.dbClient = dbClient;
    this.treeRootHolder = treeRootHolder;
    this.analysisMetadataHolder = analysisMetadataHolder;
    this.taskMessages = taskMessages;
    this.system2 = system2;
  }

  @Override
  public void execute(ComputationStep.Context context) {
    try (DbSession dbSession = dbClient.openSession(false)) {
      validateTargetBranch(dbSession);
      Component root = treeRootHolder.getRoot();
      // FIXME if module have really be dropped, no more need to load them
      List<ComponentDto> baseModules = dbClient.componentDao().selectEnabledModulesFromProjectKey(dbSession, root.getDbKey());
      Map<String, ComponentDto> baseModulesByKey = baseModules.stream().collect(Collectors.toMap(ComponentDto::getDbKey, x -> x));
      ValidateProjectsVisitor visitor = new ValidateProjectsVisitor(dbSession, dbClient.componentDao(), baseModulesByKey);
      new DepthTraversalTypeAwareCrawler(visitor).visit(root);

      if (!visitor.validationMessages.isEmpty()) {
        throw MessageException.of("Validation of project failed:\n  o " + MESSAGES_JOINER.join(visitor.validationMessages));
      }
    }
  }

  private void validateTargetBranch(DbSession session) {
    if (!analysisMetadataHolder.isPullRequest()) {
      return;
    }
    String referenceBranchUuid = analysisMetadataHolder.getBranch().getReferenceBranchUuid();
    int moduleCount = dbClient.componentDao().countEnabledModulesByProjectUuid(session, referenceBranchUuid);
    if (moduleCount > 0) {
      Optional<BranchDto> opt = dbClient.branchDao().selectByUuid(session, referenceBranchUuid);
      checkState(opt.isPresent(), "Reference branch '%s' does not exist", referenceBranchUuid);
      throw MessageException.of(String.format(
        "Due to an upgrade, you need first to re-analyze the target branch '%s' before analyzing this pull request.", opt.get().getKey()));
    }
  }

  @Override
  public String getDescription() {
    return "Validate project";
  }

  private class ValidateProjectsVisitor extends TypeAwareVisitorAdapter {
    private final DbSession session;
    private final ComponentDao componentDao;
    private final Map<String, ComponentDto> baseModulesByKey;
    private final List<String> validationMessages = new ArrayList<>();

    public ValidateProjectsVisitor(DbSession session, ComponentDao componentDao, Map<String, ComponentDto> baseModulesByKey) {
      super(CrawlerDepthLimit.PROJECT, ComponentVisitor.Order.PRE_ORDER);
      this.session = session;
      this.componentDao = componentDao;
      this.baseModulesByKey = baseModulesByKey;
    }

    @Override
    public void visitProject(Component rawProject) {
      String rawProjectKey = rawProject.getDbKey();
      Optional<ComponentDto> baseProjectOpt = loadBaseComponent(rawProjectKey);
      validateAnalysisDate(baseProjectOpt);
      if (!baseProjectOpt.isPresent()) {
        return;
      }
      if (!isValidProjectKey(baseProjectOpt.get().getKey())) {
        ComponentDto baseProject = baseProjectOpt.get();
        // As it was possible in the past to use project key with a format that is no more compatible, we need to display a warning to the user in
        // order for him to update his project key.
        // SONAR-13191 This warning should be removed in 9.0, and instead the analysis should fail
        taskMessages.add(new CeTaskMessages.Message(
          format("The project key ‘%s’ contains invalid characters. %s. You should update the project key with the expected format.", baseProject.getKey(),
            ALLOWED_CHARACTERS_MESSAGE),
          system2.now()));
      }
    }

    private void validateAnalysisDate(Optional<ComponentDto> baseProject) {
      if (baseProject.isPresent()) {
        Optional<SnapshotDto> snapshotDto = dbClient.snapshotDao().selectLastAnalysisByRootComponentUuid(session, baseProject.get().uuid());
        long currentAnalysisDate = analysisMetadataHolder.getAnalysisDate();
        Long lastAnalysisDate = snapshotDto.map(SnapshotDto::getCreatedAt).orElse(null);
        if (lastAnalysisDate != null && currentAnalysisDate <= lastAnalysisDate) {
          validationMessages.add(format("Date of analysis cannot be older than the date of the last known analysis on this project. Value: \"%s\". " +
            "Latest analysis: \"%s\". It's only possible to rebuild the past in a chronological order.",
            formatDateTime(new Date(currentAnalysisDate)), formatDateTime(new Date(lastAnalysisDate))));
        }
      }
    }

    private Optional<ComponentDto> loadBaseComponent(String rawComponentKey) {
      ComponentDto baseComponent = baseModulesByKey.get(rawComponentKey);
      if (baseComponent == null) {
        // Load component from key to be able to detect issue (try to analyze a module, etc.)
        return componentDao.selectByKey(session, rawComponentKey);
      }
      return Optional.of(baseComponent);
    }
  }

}
