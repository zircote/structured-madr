# Contributing to Structured MADR

Thank you for your interest in contributing to Structured MADR! This document provides guidelines for contributing to the specification, templates, and tooling.

## Ways to Contribute

### 1. Specification Feedback

The Structured MADR specification is designed to be comprehensive yet practical. We welcome feedback on:

- **Clarity**: Are any sections unclear or ambiguous?
- **Completeness**: Are there missing elements that would improve the format?
- **Practicality**: Are any requirements too burdensome for real-world use?

Open an issue with the `specification` label to discuss proposed changes.

### 2. Template Improvements

Templates should be:

- Easy to use as starting points
- Self-documenting with helpful placeholders
- Consistent with the specification

Submit pull requests for template improvements with clear descriptions of the changes.

### 3. Example ADRs

High-quality examples help users understand the format. Good examples:

- Address real architectural decisions
- Demonstrate all required sections
- Show proper use of frontmatter fields
- Include realistic audit entries

### 4. Tooling Integration

If you're building tools that work with Structured MADR:

- Validate against the JSON Schema
- Follow the specification requirements
- Consider contributing integration guides

## Development Process

### Reporting Issues

1. Check existing issues to avoid duplicates
2. Use the appropriate issue template
3. Provide clear reproduction steps for bugs
4. Include relevant context for feature requests

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-improvement`)
3. Make your changes
4. Ensure all examples validate against the schema
5. Update documentation as needed
6. Submit a pull request with a clear description

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `spec`: Specification changes
- `chore`: Maintenance tasks

### Code of Conduct

- Be respectful and constructive
- Focus on the technical merits of proposals
- Welcome newcomers and help them contribute

## Specification Changes

Changes to the core specification require:

1. **Discussion**: Open an issue explaining the rationale
2. **Consensus**: Allow time for community feedback
3. **Documentation**: Update specification and examples
4. **Versioning**: Follow semantic versioning for the spec

### Backward Compatibility

We strive to maintain backward compatibility:

- New optional fields can be added in minor versions
- Required fields require major version bumps
- Deprecation should provide migration paths

## Validation

All contributions should:

1. **Schema Compliance**: Examples must validate against `schemas/structured-madr.schema.json`
2. **Specification Compliance**: Content must follow `SPECIFICATION.md`
3. **Markdown Validity**: Use proper Markdown syntax

### Running Validation

```bash
# Validate frontmatter against schema (requires ajv-cli)
npx ajv validate -s schemas/structured-madr.schema.json -d examples/*.md --spec=draft7

# Or use any JSON Schema validator
```

## Questions?

- Open a discussion for general questions
- Check existing issues and discussions first
- Be specific about what you're trying to accomplish

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
