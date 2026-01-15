# Structured MADR Specification

**Version:** 1.0.0
**Status:** Stable
**Last Updated:** 2026-01-15

## Abstract

This document specifies the Structured MADR format, an extension of MADR (Markdown Architectural Decision Records) that adds machine-readable YAML frontmatter, comprehensive option analysis with risk assessments, and required audit sections for compliance tracking.

## Status of This Document

This is the official specification for Structured MADR version 1.0.0. The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

## 1. Introduction

### 1.1 Purpose

Structured MADR provides a standardized format for documenting architectural decisions that is:

1. **Human-readable** - Clear prose documentation for developers
2. **Machine-parseable** - Structured metadata for tooling
3. **Auditable** - Built-in compliance tracking
4. **Comprehensive** - Complete option analysis with risk assessment

### 1.2 Relationship to MADR

Structured MADR is a superset of MADR 4.0.0. Any valid MADR document can be converted to Structured MADR by adding the required frontmatter and audit section. The body sections follow MADR conventions with extensions for hierarchical organization.

### 1.3 Design Goals

1. **Backward Compatibility** - MADR-compatible section structure
2. **Forward Compatibility** - Extensible frontmatter schema
3. **Tool Interoperability** - Standard YAML and Markdown
4. **AI Optimization** - Metadata designed for LLM context injection

## 2. Document Structure

A Structured MADR document MUST contain the following components in order:

1. YAML Frontmatter (Section 3)
2. Title (Section 4.1)
3. Status Section (Section 4.2)
4. Context Section (Section 4.3)
5. Decision Drivers Section (Section 4.4)
6. Considered Options Section (Section 4.5)
7. Decision Section (Section 4.6)
8. Consequences Section (Section 4.7)
9. Decision Outcome Section (Section 4.8)
10. Related Decisions Section (Section 4.9)
11. Links Section (Section 4.10)
12. More Information Section (Section 4.11)
13. Audit Section (Section 4.12)

## 3. YAML Frontmatter

### 3.1 Format

The frontmatter MUST be enclosed in YAML document markers (`---`) at the beginning of the file.

```yaml
---
# Frontmatter content
---
```

### 3.2 Required Fields

The following fields MUST be present in every Structured MADR document:

#### 3.2.1 `title`

- **Type:** string
- **Description:** A short, descriptive title for the decision
- **Constraints:**
  - MUST be non-empty
  - SHOULD be 60 characters or fewer
  - SHOULD use title case

```yaml
title: "Use PostgreSQL for Primary Storage"
```

#### 3.2.2 `description`

- **Type:** string
- **Description:** A one-sentence summary of the decision
- **Constraints:**
  - MUST be non-empty
  - SHOULD be 160 characters or fewer

```yaml
description: "Decision to adopt PostgreSQL as the primary database for the application"
```

#### 3.2.3 `type`

- **Type:** string
- **Description:** Document type identifier
- **Constraints:**
  - MUST be exactly `"adr"`

```yaml
type: adr
```

#### 3.2.4 `category`

- **Type:** string
- **Description:** The category of decision
- **Constraints:**
  - MUST be non-empty
  - RECOMMENDED values: `architecture`, `api`, `security`, `performance`, `infrastructure`, `migration`, `integration`, `data`, `testing`

```yaml
category: architecture
```

#### 3.2.5 `tags`

- **Type:** array of strings
- **Description:** Keywords for categorization and search
- **Constraints:**
  - MUST contain at least one tag
  - Tags SHOULD be lowercase with hyphens for multi-word tags

```yaml
tags:
  - database
  - postgresql
  - storage
```

#### 3.2.6 `status`

- **Type:** string (enum)
- **Description:** Current status of the decision
- **Allowed Values:**
  - `proposed` - Decision is under consideration
  - `accepted` - Decision has been approved and is in effect
  - `deprecated` - Decision is no longer recommended
  - `superseded` - Decision has been replaced by another ADR
- **Constraints:**
  - MUST be one of the allowed values

```yaml
status: accepted
```

#### 3.2.7 `created`

- **Type:** date
- **Description:** Date the ADR was created
- **Format:** ISO 8601 date (YYYY-MM-DD)

```yaml
created: 2025-01-15
```

#### 3.2.8 `updated`

- **Type:** date
- **Description:** Date the ADR was last modified
- **Format:** ISO 8601 date (YYYY-MM-DD)
- **Constraints:**
  - MUST be greater than or equal to `created`

```yaml
updated: 2025-01-20
```

#### 3.2.9 `author`

- **Type:** string
- **Description:** The author or team responsible for the decision
- **Constraints:**
  - MUST be non-empty

```yaml
author: Architecture Team
```

#### 3.2.10 `project`

- **Type:** string
- **Description:** The project this decision applies to
- **Constraints:**
  - MUST be non-empty
  - SHOULD be a consistent identifier across all project ADRs

```yaml
project: my-application
```

### 3.3 Optional Fields

The following fields MAY be present:

#### 3.3.1 `technologies`

- **Type:** array of strings
- **Description:** Technologies referenced or affected by this decision

```yaml
technologies:
  - postgresql
  - rust
  - tokio
```

#### 3.3.2 `audience`

- **Type:** array of strings
- **Description:** Intended readers of this ADR
- **RECOMMENDED values:** `developers`, `architects`, `operators`, `stakeholders`

```yaml
audience:
  - developers
  - architects
```

#### 3.3.3 `related`

- **Type:** array of strings
- **Description:** Filenames of related ADRs
- **Constraints:**
  - SHOULD be relative filenames within the same ADR directory

```yaml
related:
  - adr_0001.md
  - adr_0005.md
```

## 4. Body Sections

### 4.1 Title

The document title MUST be an H1 heading in the format:

```markdown
# ADR-{NUMBER}: {TITLE}
```

Where:
- `{NUMBER}` is a unique identifier (typically zero-padded, e.g., `0001`)
- `{TITLE}` matches the frontmatter `title` field

### 4.2 Status Section

The status section MUST be an H2 heading containing the current status.

```markdown
## Status

Accepted
```

If the ADR supersedes another, this SHOULD be noted:

```markdown
## Status

Accepted

Supersedes ADR-0003
```

### 4.3 Context Section

The context section MUST be an H2 heading with the following subsections:

#### 4.3.1 Background and Problem Statement

An H3 subsection describing the situation requiring a decision.

```markdown
## Context

### Background and Problem Statement

{Description of the context and the problem being solved}
```

#### 4.3.2 Current Limitations (Optional)

An H3 subsection listing limitations of the current approach.

```markdown
### Current Limitations

{Numbered or bulleted list of limitations}
```

### 4.4 Decision Drivers Section

The decision drivers section MUST be an H2 heading with hierarchical subsections:

#### 4.4.1 Primary Decision Drivers

An H3 subsection listing the most important factors.

```markdown
## Decision Drivers

### Primary Decision Drivers

1. **{Driver Name}**: {Explanation}
2. **{Driver Name}**: {Explanation}
```

#### 4.4.2 Secondary Decision Drivers

An H3 subsection listing influential but non-decisive factors.

```markdown
### Secondary Decision Drivers

1. **{Driver Name}**: {Explanation}
```

### 4.5 Considered Options Section

The options section MUST be an H2 heading with an H3 subsection for each option.

#### 4.5.1 Option Structure

Each option MUST include:

1. **Description** - Brief overview
2. **Technical Characteristics** - Key technical attributes
3. **Advantages** - Benefits of this option
4. **Disadvantages** - Drawbacks of this option

Each option SHOULD include:

5. **Risk Assessment** - Technical, schedule, and ecosystem risk ratings

Each option MAY include:

6. **Disqualifying Factor** - Reason for rejection (if applicable)

```markdown
## Considered Options

### Option 1: {Title}

**Description**: {Brief description}

**Technical Characteristics**:
- {Characteristic 1}
- {Characteristic 2}

**Advantages**:
- {Advantage 1}
- {Advantage 2}

**Disadvantages**:
- {Disadvantage 1}
- {Disadvantage 2}

**Risk Assessment**:
- **Technical Risk**: {Low|Medium|High}. {Explanation}
- **Schedule Risk**: {Low|Medium|High}. {Explanation}
- **Ecosystem Risk**: {Low|Medium|High}. {Explanation}
```

### 4.6 Decision Section

The decision section MUST be an H2 heading stating the chosen option and implementation details.

```markdown
## Decision

{Clear statement of the decision}

The implementation will use:
- **{Component}** for {purpose}
- **{Component}** for {purpose}
```

### 4.7 Consequences Section

The consequences section MUST be an H2 heading with three subsections:

```markdown
## Consequences

### Positive

1. **{Title}**: {Description}

### Negative

1. **{Title}**: {Description}

### Neutral

1. **{Title}**: {Description}
```

### 4.8 Decision Outcome Section

The outcome section MUST be an H2 heading summarizing results and mitigations.

```markdown
## Decision Outcome

{Summary of how objectives are achieved}

Mitigations:
- {Mitigation for negative consequence}
```

### 4.9 Related Decisions Section

The related decisions section MUST be an H2 heading linking to related ADRs.

```markdown
## Related Decisions

- [ADR-{NUMBER}: {Title}]({filename}) - {Relationship description}
```

### 4.10 Links Section

The links section MUST be an H2 heading with external resources.

```markdown
## Links

- [{Resource Name}]({URL}) - {Description}
```

### 4.11 More Information Section

The more information section MUST be an H2 heading with metadata.

```markdown
## More Information

- **Date:** {DATE}
- **Source:** {Reference}
- **Related ADRs:** {List}
```

### 4.12 Audit Section

The audit section MUST be an H2 heading and MUST be present in all Structured MADR documents.

#### 4.12.1 Audit Entry Structure

Each audit entry MUST be an H3 heading with the audit date and contain:

1. **Status** - Audit result
2. **Findings** - Table of specific findings
3. **Summary** - Brief summary
4. **Action Required** - Required remediation

```markdown
## Audit

### {YYYY-MM-DD}

**Status:** {Pending|Compliant|Non-Compliant|Partial}

**Findings:**

| Finding | Files | Lines | Assessment |
|---------|-------|-------|------------|
| {Description} | `{file}` | L{n}-L{m} | {compliant|non-compliant|partial} |

**Summary:** {Brief summary}

**Action Required:** {None|Description of required actions}
```

#### 4.12.2 Initial Audit Entry

New ADRs SHOULD have an initial audit entry with status `Pending`:

```markdown
## Audit

### {DATE}

**Status:** Pending

**Findings:**

| Finding | Files | Lines | Assessment |
|---------|-------|-------|------------|
| Awaiting implementation | - | - | pending |

**Summary:** ADR created, awaiting implementation.

**Action Required:** Implement decision and audit
```

## 5. File Naming

Structured MADR files SHOULD follow the naming convention:

```
{NUMBER}-{slug}.md
```

Or:

```
adr_{NUMBER}.md
```

Where:
- `{NUMBER}` is a zero-padded identifier (e.g., `0001`, `0042`)
- `{slug}` is a URL-friendly version of the title

Examples:
- `0001-use-postgresql-for-primary-storage.md`
- `adr_0001.md`

## 6. Validation

A Structured MADR document is valid if:

1. The YAML frontmatter is syntactically valid YAML
2. All required frontmatter fields are present with valid values
3. All required body sections are present
4. The audit section contains at least one entry
5. The document conforms to the JSON Schema in `schemas/structured-madr.schema.json`

## 7. Extensions

### 7.1 Custom Frontmatter Fields

Implementations MAY add custom frontmatter fields prefixed with `x-`:

```yaml
x-review-board: ["alice", "bob"]
x-implementation-phase: 2
```

Custom fields MUST NOT conflict with reserved field names.

### 7.2 Custom Sections

Implementations MAY add custom sections after the Audit section.

## 8. MIME Type

The RECOMMENDED MIME type for Structured MADR documents is:

```
text/markdown; variant=structured-madr
```

## 9. Security Considerations

- Frontmatter SHOULD NOT contain sensitive information
- File paths in audit findings SHOULD be relative
- External links SHOULD use HTTPS

## Appendix A: Complete Example

See `examples/complete-example.md` for a fully compliant example.

## Appendix B: Changelog

### Version 1.0.0 (2026-01-15)

- Initial release
- YAML frontmatter specification
- Body section requirements
- Audit section specification
- JSON Schema definition
