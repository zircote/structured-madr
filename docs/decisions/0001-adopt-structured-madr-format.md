---
title: "Adopt Structured MADR Format for Project Documentation"
description: "Decision to use the Structured MADR format for documenting architectural decisions within this project, demonstrating dogfooding and serving as exemplars."
type: adr
category: documentation
tags:
  - adr
  - documentation
  - dogfooding
  - madr
  - structured-format
status: accepted
created: 2026-01-15
updated: 2026-01-15
author: Project Maintainers
project: structured-madr
technologies:
  - markdown
  - yaml
  - json-schema
audience:
  - developers
  - architects
  - contributors
related:
  - 0002-github-action-validator.md
---

# ADR-0001: Adopt Structured MADR Format for Project Documentation

## Status

Accepted

## Context

### Background and Problem Statement

The Structured MADR project defines a specification for machine-readable architectural decision records. To ensure the specification is practical, usable, and well-documented, the project itself should use the format it defines. This practice, known as "dogfooding," provides several benefits: it validates the specification against real-world usage, creates exemplar documents for users to reference, and ensures maintainers experience the format as users would.

### Current Limitations

1. **No Existing ADRs**: The project currently lacks formal architectural decision records documenting design choices made during specification development.

2. **Specification Without Examples**: While the project includes example ADRs in the `examples/` directory, these are for hypothetical external projects rather than documenting decisions about this project itself.

3. **Missing Self-Validation**: Without ADRs using the format, the project cannot demonstrate that its own validation tools work correctly on real documents.

## Decision Drivers

### Primary Decision Drivers

1. **Dogfooding Requirement**: The project must use its own format to validate that the specification is practical and usable in real-world scenarios.

2. **Exemplar Documentation**: ADRs within this project should serve as reference implementations that users can study when creating their own ADRs.

3. **Self-Validation**: The project's validation tooling must be testable against its own ADRs, ensuring the tools work correctly.

### Secondary Decision Drivers

1. **Contributor Guidance**: Formal ADRs help new contributors understand why certain design decisions were made.

2. **Specification Evolution**: Documenting decisions enables tracking how and why the specification evolves over time.

3. **Quality Assurance**: Using the format internally surfaces usability issues that might not be apparent from specification review alone.

## Considered Options

### Option 1: Full Structured MADR Format

**Description**: Adopt the complete Structured MADR 1.0 format with all required sections, YAML frontmatter, and audit entries for all project ADRs.

**Technical Characteristics**:
- Full YAML frontmatter with all 10 required fields
- All 12 required body sections in specified order
- Risk assessments for each considered option
- Mandatory audit section with compliance tracking

**Advantages**:
- Complete demonstration of the format's capabilities
- Validates all aspects of the specification
- Provides comprehensive exemplars for users
- Enables full validation testing

**Disadvantages**:
- Requires more effort per ADR than simpler formats
- Some sections may feel excessive for straightforward decisions
- Learning curve for contributors unfamiliar with the format

**Risk Assessment**:
- **Technical Risk**: Low. The format is well-defined and documented.
- **Schedule Risk**: Low. ADR creation is a one-time effort per decision.
- **Ecosystem Risk**: Low. Markdown and YAML are universally supported.

### Option 2: Standard MADR 4.0 Format

**Description**: Use the standard MADR 4.0 format without the structured extensions, providing simpler ADRs.

**Technical Characteristics**:
- Minimal frontmatter or none
- Flexible section ordering
- No mandatory audit sections

**Advantages**:
- Faster to write
- Lower barrier for contributors
- Wider familiarity in the community

**Disadvantages**:
- Does not demonstrate the project's own format
- Cannot validate structured frontmatter parsing
- Fails the dogfooding objective
- Provides no exemplars of the extended format

**Disqualifying Factor**: Using a different ADR format than the one this project defines would undermine the project's credibility and fail to validate the specification.

**Risk Assessment**:
- **Technical Risk**: Low. MADR 4.0 is well-established.
- **Schedule Risk**: Low. Faster to write.
- **Ecosystem Risk**: High. Fails to validate the project's own format.

### Option 3: No Formal ADR Process

**Description**: Document decisions informally in README or CHANGELOG without structured ADRs.

**Technical Characteristics**:
- Informal prose documentation
- No standardized format
- Decisions scattered across multiple files

**Advantages**:
- Minimal overhead
- No format constraints

**Disadvantages**:
- No demonstration of the format
- Difficult to find specific decisions
- No validation possible
- Poor contributor experience
- Unprofessional for a documentation-focused project

**Disqualifying Factor**: A project defining an ADR format that doesn't use ADRs would lack credibility.

**Risk Assessment**:
- **Technical Risk**: Low. No technical complexity.
- **Schedule Risk**: Low. No structured process.
- **Ecosystem Risk**: Critical. Project credibility severely impacted.

## Decision

We will adopt the full Structured MADR 1.0 format for all architectural decisions within this project.

ADRs will be stored in `docs/decisions/` with the naming convention `{NUMBER}-{slug}.md`. Each ADR will include:
- Complete YAML frontmatter with all required fields
- All mandatory body sections in the specified order
- Risk assessments for each considered option
- Audit entries tracking compliance

These ADRs will serve dual purposes:
1. Documenting actual project decisions
2. Providing exemplar documents for users to reference

## Consequences

### Positive

1. **Credible Dogfooding**: Using our own format demonstrates confidence in its practicality and validates the specification against real usage.

2. **Living Exemplars**: Project ADRs serve as reference implementations that stay current with specification changes.

3. **Validation Test Cases**: ADRs provide real documents for testing validation tooling, ensuring the tools work correctly.

4. **Decision History**: Future maintainers can understand why decisions were made by reading the relevant ADRs.

### Negative

1. **Higher Initial Effort**: Writing full Structured MADR documents requires more time than informal documentation.

2. **Maintenance Burden**: Audit sections must be updated periodically to remain useful.

### Neutral

1. **Format Constraints**: The structured format may occasionally feel constraining, but this friction helps identify specification improvements.

## Decision Outcome

By adopting Structured MADR for this project, we achieve:
- Credible demonstration that the format works in practice
- High-quality exemplars for users to reference
- Test cases for validation tooling
- Clear documentation of project decisions

Mitigations for increased effort:
- Provide templates to accelerate ADR creation
- Document common patterns in CONTRIBUTING.md
- Use validation tooling to catch errors early

## Related Decisions

- [ADR-0002: GitHub Action Validator](0002-github-action-validator.md) - Provides automated validation for these ADRs

## Links

- [MADR Project](https://adr.github.io/madr/) - Original MADR specification
- [Structured MADR Specification](../../SPECIFICATION.md) - Full specification for this format
- [ADR GitHub Organization](https://adr.github.io/) - Community resources for ADRs

## More Information

- **Date:** 2026-01-15
- **Source:** Project initialization and dogfooding requirements
- **Related ADRs:** ADR-0002

## Audit

### 2026-01-15

**Status:** Compliant

**Findings:**

| Finding | Files | Lines | Assessment |
|---------|-------|-------|------------|
| ADR directory created | `docs/decisions/` | - | compliant |
| Format follows specification | `0001-adopt-structured-madr-format.md` | L1-L227 | compliant |
| All required frontmatter fields present | `0001-adopt-structured-madr-format.md` | L1-L27 | compliant |
| All required body sections present | `0001-adopt-structured-madr-format.md` | L29-L227 | compliant |

**Summary:** Initial ADR created following the Structured MADR 1.0 specification. All required sections and fields are present.

**Action Required:** None
