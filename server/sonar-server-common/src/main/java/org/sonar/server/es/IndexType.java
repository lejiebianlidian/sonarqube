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
package org.sonar.server.es;

import com.google.common.base.Splitter;
import java.util.List;
import java.util.Objects;
import javax.annotation.concurrent.Immutable;

import static com.google.common.base.Preconditions.checkArgument;
import static java.util.Objects.requireNonNull;

public abstract class IndexType {

  public static final String FIELD_INDEX_TYPE = "indexType";

  private static final String SEPARATOR = "/";
  private static final Splitter SEPARATOR_SPLITTER = Splitter.on(SEPARATOR);

  public abstract IndexMainType getMainType();

  public abstract String format();

  /**
   * Parse a String generated by {@link #format()} to extract the simple details of the main type.
   * <p>
   * Note: neither {@link IndexMainType} nor {@link IndexRelationType} can be parsed from the string generated by
   * {@link #format()} as the generated string does not contain the {@link Index#acceptsRelations() acceptsRelations}
   * flag).
   */
  public static SimpleIndexMainType parseMainType(String s) {
    List<String> split = SEPARATOR_SPLITTER.splitToList(s);
    checkArgument(split.size() >= 2, "Unsupported IndexType value: %s", s);

    return new SimpleIndexMainType(split.get(0), split.get(1));
  }

  @Immutable
  public static final class SimpleIndexMainType {
    private final String index;
    private final String type;

    private SimpleIndexMainType(String index, String type) {
      this.index = index;
      this.type = type;
    }

    public String getIndex() {
      return index;
    }

    public String getType() {
      return type;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }
      SimpleIndexMainType that = (SimpleIndexMainType) o;
      return index.equals(that.index) && type.equals(that.type);
    }

    @Override
    public int hashCode() {
      return Objects.hash(index, type);
    }

    @Override
    public String toString() {
      return "[" + index + '/' + type + ']';
    }
  }

  public static IndexMainType main(Index index, String type) {
    return new IndexMainType(index, type);
  }

  public static IndexRelationType relation(IndexMainType mainType, String name) {
    checkArgument(mainType.getIndex().acceptsRelations(), "Index must define a join field to have relations");

    return new IndexRelationType(mainType, name);
  }

  @Immutable
  public static final class IndexMainType extends IndexType {
    private final Index index;
    private final String type;
    private final String key;

    private IndexMainType(Index index, String type) {
      this.index = requireNonNull(index);
      checkArgument(type != null && !type.isEmpty(), "type name can't be null nor empty");
      this.type = type;
      this.key = index.getName() + SEPARATOR + type;
    }

    @Override
    public IndexMainType getMainType() {
      return this;
    }

    public Index getIndex() {
      return index;
    }

    public String getType() {
      return type;
    }

    @Override
    public String format() {
      return key;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }

      IndexMainType indexType = (IndexMainType) o;
      return index.equals(indexType.index) && type.equals(indexType.type);
    }

    @Override
    public int hashCode() {
      return Objects.hash(index, type);
    }

    @Override
    public String toString() {
      return "[" + key + "]";
    }

  }

  @Immutable
  public static final class IndexRelationType extends IndexType {
    private final IndexMainType mainType;
    private final String name;
    private final String key;

    private IndexRelationType(IndexMainType mainType, String name) {
      this.mainType = mainType;
      checkArgument(name != null && !name.isEmpty(), "type name can't be null nor empty");
      this.name = name;
      this.key = mainType.index.getName() + "/" + mainType.type + "/" + name;
    }

    @Override
    public IndexMainType getMainType() {
      return mainType;
    }

    public String getName() {
      return name;
    }

    @Override
    public String format() {
      return key;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }

      IndexRelationType indexType = (IndexRelationType) o;
      return mainType.equals(indexType.mainType) && name.equals(indexType.name);
    }

    @Override
    public int hashCode() {
      return Objects.hash(mainType, name);
    }

    @Override
    public String toString() {
      return "[" + key + "]";
    }
  }
}
