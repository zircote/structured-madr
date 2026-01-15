---
title: "Rust as Implementation Language"
description: "Decision to rewrite the system from Python to Rust for improved performance, distribution simplicity, and compile-time safety guarantees."
type: adr
category: architecture
tags:
  - rust
  - language-choice
  - performance
  - distribution
  - rewrite
status: accepted
created: 2025-12-28
updated: 2026-01-04
author: Architecture Team
project: subcog
technologies:
  - rust
  - tokio
  - python
audience:
  - developers
  - architects
related:
  - 0002-three-layer-storage.md
  - 0003-feature-tier-system.md
---

# ADR-0001: Rust as Implementation Language

## Status

Accepted

## Context

### Background and Problem Statement

Subcog is a persistent memory system for AI coding assistants that captures decisions, learnings, and context from coding sessions. The original implementation was written in Python as a proof-of-concept. While that Python implementation successfully validated the core architecture and achieved greater than 90% test coverage, it exhibited fundamental limitations that would constrain the system's long-term viability as a production tool.

### Current Limitations

1. **Complex Distribution Requirements**: Python applications require end users to have a compatible Python runtime (Python 3.10+), pip for package management, and typically a virtual environment. This creates significant friction for adoption.

2. **Unacceptable Startup Latency**: The Python implementation exhibited cold start times exceeding 500 milliseconds, primarily from loading machine learning models. This latency degrades user experience in interactive AI coding sessions.

3. **Global Interpreter Lock (GIL) Constraints**: Python's GIL prevents true parallelism in CPU-bound operations. Embedding generation and vector search are CPU-bound, limiting multi-core utilization.

4. **Runtime Type Safety Limitations**: Despite type hints and mypy, Python's dynamic typing means type errors manifest at runtime rather than compile time, risking data corruption.

## Decision Drivers

### Primary Decision Drivers

1. **Single-Binary Distribution**: The system must be distributable as a single executable under 100MB without external dependencies. Users should download and run without installing runtimes or package managers.

2. **Sub-10ms Cold Start**: The system must start and process requests within 10 milliseconds for seamless integration with AI coding assistant hooks.

3. **True Parallelism**: The system must utilize multiple CPU cores for embedding generation and vector search operations.

### Secondary Decision Drivers

1. **Compiler-Enforced Code Quality**: Clippy provides pedantic lints that catch subtle issues and enforce consistent idioms.

2. **Cross-Platform Compilation**: Rust's cross-compilation support enables building binaries for multiple platforms from a single development machine.

## Considered Options

### Option 1: Rust

**Description**: Complete rewrite using tokio for async runtime, fastembed for embeddings, usearch for vector search.

**Technical Characteristics**:
- Compiled to native machine code
- Zero-cost abstractions for high-level patterns
- Ownership system for memory safety without GC
- Algebraic data types for type-safe state machines

**Advantages**:
- Single static binary (~60MB with all features)
- Cold start under 10ms (5ms for cached paths)
- True parallelism via tokio multi-threaded runtime
- Compile-time memory safety via borrow checker
- No garbage collection pauses
- Excellent async ecosystem (tokio, tower, hyper)

**Disadvantages**:
- Steeper learning curve requiring understanding of ownership and lifetimes
- Longer compilation times (debug: ~30s, release: ~2min)
- Smaller ecosystem for some AI/ML libraries compared to Python

**Risk Assessment**:
- **Technical Risk**: Low. Rust is mature and well-documented.
- **Schedule Risk**: Medium. Initial development takes longer due to learning curve.
- **Ecosystem Risk**: Low. All required libraries (fastembed, usearch, rusqlite) are available.

### Option 2: Go

**Description**: Rewrite using goroutines for concurrency, with CGO bridges for embedding generation.

**Technical Characteristics**:
- Compiled to native machine code
- Built-in goroutines and channels for concurrency
- Garbage collected with concurrent GC

**Advantages**:
- Simple, readable syntax with gentle learning curve
- Fast compilation times (typically under 10s)
- Single static binary distribution
- Strong standard library for networking

**Disadvantages**:
- GC pauses of 10-100ms conflict with sub-10ms cold start requirement
- CGO required for embeddings, adding complexity and memory safety issues at FFI boundaries
- No native embedding library (would need Python interop or C++ ONNX Runtime via CGO)

**Disqualifying Factor**: GC pause times directly conflict with the sub-10ms cold start requirement.

**Risk Assessment**:
- **Technical Risk**: Medium. CGO bridges add complexity.
- **Schedule Risk**: Low. Gentle learning curve.
- **Ecosystem Risk**: High. No native embedding library.

### Option 3: C++

**Description**: Rewrite using modern C++20 features with Boost.Asio for async operations.

**Technical Characteristics**:
- Compiled to native machine code
- Manual memory management with smart pointers
- Template metaprogramming for generic code

**Advantages**:
- Maximum performance with zero-overhead abstractions
- Extensive ML ecosystem (ONNX Runtime, TensorFlow, PyTorch)
- No garbage collection

**Disadvantages**:
- No compile-time memory safety; error-prone even with smart pointers
- Build system complexity (CMake, conan, vcpkg)
- Undefined behavior risks from subtle language features

**Disqualifying Factor**: Lack of compile-time memory safety is unacceptable for a project prioritizing correctness.

**Risk Assessment**:
- **Technical Risk**: High. Memory safety bugs likely in complex async code.
- **Schedule Risk**: High. C++ development slower due to build complexity.
- **Ecosystem Risk**: Low. Extensive libraries available.

## Decision

We will rewrite the entire Subcog system in Rust.

The implementation will use:
- **tokio** for the async runtime with multi-threaded work-stealing scheduler
- **rusqlite** (with bundled SQLite) for persistence and FTS5 full-text indexing
- **fastembed** (optional feature) for local embedding generation using ONNX Runtime
- **usearch** (optional feature) for HNSW approximate nearest neighbor search
- **rmcp** for Model Context Protocol server implementation

## Consequences

### Positive

1. **Single Static Binary Distribution**: The release build produces a ~60MB binary including all functionality. Users download one file and run it without dependencies.

2. **50x Startup Performance Improvement**: Cold start reduced from ~500ms to ~10ms. This enables seamless integration with AI assistant hooks.

3. **True Parallelism**: The tokio multi-threaded runtime enables parallel execution across all available cores without GIL constraints.

4. **Compile-Time Memory Safety**: The borrow checker eliminates use-after-free, double-free, and data races at compile time.

### Negative

1. **Extended Initial Development Time**: The rewrite required approximately 3x longer initial development compared to equivalent Python code due to the learning curve.

2. **Steeper Learning Curve for Contributors**: New contributors must understand Rust's ownership model, lifetimes, and async patterns.

### Neutral

1. **Architecture Validation Already Complete**: The Python proof-of-concept validated the core architecture, so the Rust rewrite focused on implementation quality.

## Decision Outcome

The Rust rewrite achieved its primary objectives:
- Distribution: Single binary of ~60MB
- Startup: Cold start under 10ms
- Parallelism: Full multi-core utilization via tokio
- Safety: Zero runtime panics enforced by clippy lints

Mitigations:
- Document ownership patterns for new contributors
- Use Cargo incremental compilation to reduce dev cycle times
- Rely on fastembed for embedding needs rather than building custom ML infrastructure

## Related Decisions

- [ADR-0002: Three-Layer Storage Architecture](0002-three-layer-storage.md) - Storage design leverages Rust trait system
- [ADR-0003: Feature Tier System](0003-feature-tier-system.md) - Feature organization enabled by Cargo features

## Links

- [fastembed crate](https://crates.io/crates/fastembed) - Native Rust embedding generation
- [tokio runtime](https://tokio.rs/) - Async runtime for Rust
- [usearch crate](https://crates.io/crates/usearch) - HNSW vector search

## More Information

- **Date:** 2025-12-28
- **Source:** SPEC-2025-12-28: Subcog Rust Rewrite
- **Related ADRs:** ADR-0002, ADR-0003, ADR-0004

## Audit

### 2026-01-04

**Status:** Compliant

**Findings:**

| Finding | Files | Lines | Assessment |
|---------|-------|-------|------------|
| Rust crate and binaries defined | `Cargo.toml` | L1-L22 | compliant |
| tokio async runtime configured | `src/main.rs` | L15-L30 | compliant |
| fastembed integration | `src/services/embedding.rs` | L1-L150 | compliant |

**Summary:** Rust crate and binaries confirm the implementation language decision. All specified components are integrated.

**Action Required:** None
