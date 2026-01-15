# Structured MADR

**Machine-Readable Architectural Decision Records for the AI Era**

Structured MADR is an extension of [MADR](https://adr.github.io/madr/) (Markdown Architectural Decision Records) that adds YAML frontmatter for machine-readable metadata, comprehensive option analysis with risk assessments, and required audit sections for compliance tracking.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Specification](https://img.shields.io/badge/spec-1.0.0-purple.svg)](SPECIFICATION.md)

## Why Structured MADR?

Traditional ADR formats were designed for human readers. While they capture decisions effectively, they lack:

- **Machine-readable metadata** for programmatic access
- **Structured risk assessment** for option evaluation
- **Audit trails** for compliance verification
- **Explicit relationships** between decisions

Structured MADR addresses these gaps while remaining fully human-readable and compatible with existing ADR workflows.

## Key Features

| Feature | Description |
|---------|-------------|
| **YAML Frontmatter** | Machine-parseable metadata for tooling integration |
| **Hierarchical Drivers** | Primary and secondary decision drivers |
| **Risk Assessment** | Technical, schedule, and ecosystem risk per option |
| **Split Consequences** | Positive, negative, and neutral outcomes |
| **Audit Section** | Built-in compliance tracking with findings tables |
| **Explicit Relationships** | Typed links between related decisions |

## Quick Start

### 1. Copy the Template

```bash
curl -O https://raw.githubusercontent.com/zircote/structured-madr/main/templates/template.md
mv template.md docs/adr/0001-your-decision.md
```

### 2. Fill in the Frontmatter

```yaml
---
title: "Use PostgreSQL for Primary Storage"
description: "Decision to adopt PostgreSQL as the application database"
type: adr
category: architecture
tags:
  - database
  - postgresql
status: proposed
created: 2025-01-15
updated: 2025-01-15
author: Architecture Team
project: my-application
technologies:
  - postgresql
audience:
  - developers
  - architects
---
```

### 3. Document Your Decision

Follow the template sections to capture context, options, decision, and consequences.

### 4. Add Audit Trail

After implementation, add audit entries to track compliance:

```markdown
## Audit

### 2025-02-01

**Status:** Compliant

**Findings:**

| Finding | Files | Lines | Assessment |
|---------|-------|-------|------------|
| PostgreSQL configured | `src/db/config.rs` | L15-L45 | compliant |

**Summary:** Implementation follows ADR specifications.

**Action Required:** None
```

## Template Structure

```
┌─────────────────────────────────────────────┐
│  YAML Frontmatter (Required)                │
│  - Metadata for machine parsing             │
│  - Status, dates, author, tags              │
├─────────────────────────────────────────────┤
│  # ADR-{NUMBER}: {TITLE}                    │
├─────────────────────────────────────────────┤
│  ## Status                                  │
│  - Current decision status                  │
├─────────────────────────────────────────────┤
│  ## Context                                 │
│  - Background and Problem Statement         │
│  - Current Limitations                      │
├─────────────────────────────────────────────┤
│  ## Decision Drivers                        │
│  - Primary Decision Drivers                 │
│  - Secondary Decision Drivers               │
├─────────────────────────────────────────────┤
│  ## Considered Options                      │
│  - Option 1 (with risk assessment)          │
│  - Option 2 (with risk assessment)          │
│  - ...                                      │
├─────────────────────────────────────────────┤
│  ## Decision                                │
│  - The chosen approach                      │
│  - Implementation specifics                 │
├─────────────────────────────────────────────┤
│  ## Consequences                            │
│  - Positive                                 │
│  - Negative                                 │
│  - Neutral                                  │
├─────────────────────────────────────────────┤
│  ## Decision Outcome                        │
│  - Summary and mitigations                  │
├─────────────────────────────────────────────┤
│  ## Related Decisions                       │
│  - Links to related ADRs                    │
├─────────────────────────────────────────────┤
│  ## Links                                   │
│  - External resources                       │
├─────────────────────────────────────────────┤
│  ## More Information                        │
│  - Date, source, references                 │
├─────────────────────────────────────────────┤
│  ## Audit (Required)                        │
│  - Compliance tracking entries              │
│  - Findings tables                          │
└─────────────────────────────────────────────┘
```

## Frontmatter Schema

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Short descriptive title |
| `description` | string | One-sentence summary |
| `type` | string | Always `"adr"` |
| `category` | string | Decision category |
| `tags` | array | List of relevant tags |
| `status` | enum | `proposed`, `accepted`, `deprecated`, `superseded` |
| `created` | date | Creation date (YYYY-MM-DD) |
| `updated` | date | Last update date (YYYY-MM-DD) |
| `author` | string | Decision author or team |
| `project` | string | Project identifier |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `technologies` | array | Technologies involved |
| `audience` | array | Target audience |
| `related` | array | Related ADR filenames |

## Status Values

| Status | Description | Transitions To |
|--------|-------------|----------------|
| `proposed` | Under consideration | `accepted`, `superseded` |
| `accepted` | Approved and active | `deprecated`, `superseded` |
| `deprecated` | No longer recommended | `superseded` |
| `superseded` | Replaced by another ADR | (terminal) |

## Comparison with Other Formats

| Aspect | Structured MADR | MADR | Nygard | Y-Statement | Tyree-Akerman |
|--------|-----------------|------|--------|-------------|---------------|
| Sections | 12+ | 10 | 5 | 1 | 15+ |
| Frontmatter | Required YAML | None | None | None | None |
| Options Detail | Narrative + Risk | Pros/Cons | Implicit | Single | Detailed |
| Consequences | Pos/Neg/Neutral | Single list | Prose | Implicit | Impact analysis |
| Audit Trail | Required | None | None | None | None |
| Machine-Readable | Full metadata | Limited | Limited | Limited | Limited |

## When to Use Structured MADR

### Ideal For

- **Compliance-driven projects** - SOC2, HIPAA, ISO 27001, regulated industries
- **AI-assisted development** - Claude Code, GitHub Copilot, Cursor
- **Large codebases** - Where decision discovery and search matters
- **Long-lived projects** - Need historical audit trails
- **Enterprise architecture** - Governance and traceability requirements

### Consider Alternatives When

- Quick, informal decisions → Use [Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- Single-sentence capture → Use [Y-Statement](https://medium.com/olzzio/y-statements-10eb07b5a177)
- Minimal overhead needed → Use [MADR Minimal](https://adr.github.io/madr/)
- Prototypes or throwaway projects

## Tooling Support

### Validation

Validate your ADRs against the JSON Schema:

```bash
# Using ajv-cli
npx ajv validate -s schemas/structured-madr.schema.json -d your-adr.md

# Using check-jsonschema
check-jsonschema --schemafile schemas/structured-madr.schema.json your-adr.md
```

### AI Integration

Structured MADR's frontmatter enables AI tools to:

- **Filter relevant decisions** without parsing prose
- **Understand relationships** via explicit `related` field
- **Track freshness** via `created`/`updated` timestamps
- **Scope by context** using `project`, `category`, `tags`
- **Surface by technology** using `technologies` field

### Plugins

- **[ADR Plugin for Claude Code](https://github.com/zircote/marketplace/tree/main/plugins/adr)** - Full lifecycle management

## Resources

- [Specification](SPECIFICATION.md) - Formal format specification
- [Templates](templates/) - Ready-to-use templates
- [Examples](examples/) - Real-world ADR examples
- [JSON Schema](schemas/structured-madr.schema.json) - Validation schema
- [Contributing](CONTRIBUTING.md) - How to contribute

## Acknowledgments

Structured MADR builds upon the excellent work of:

- [MADR](https://adr.github.io/madr/) - The foundation format
- [Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) - Original ADR concept
- [ADR GitHub Organization](https://github.com/adr) - ADR tooling ecosystem

## License

This project is licensed under the [MIT License](LICENSE).

## Version

**Specification:** 1.0.0
**Schema:** 1.0.0
