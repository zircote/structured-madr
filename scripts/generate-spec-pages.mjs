#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

/**
 * Parse the spec into h2 sections, respecting code fences.
 * Returns { preamble, sections } where preamble is content before the first h2
 * and sections is a Map of h2 title -> body content (without the h2 line itself).
 */
function parseSpec(specText) {
  const lines = specText.split("\n");
  let inCodeFence = false;
  let preamble = [];
  const sections = new Map();
  let currentTitle = null;
  let currentBody = [];

  for (const line of lines) {
    // Track code fence state
    if (line.trimStart().startsWith("```")) {
      inCodeFence = !inCodeFence;
    }

    // Only match h2 headings outside code fences
    if (!inCodeFence && line.startsWith("## ")) {
      // Save previous section
      if (currentTitle !== null) {
        sections.set(currentTitle, currentBody.join("\n"));
      }
      currentTitle = line.slice(3).trim();
      currentBody = [];
      continue;
    }

    if (currentTitle === null) {
      preamble.push(line);
    } else {
      currentBody.push(line);
    }
  }

  // Save last section
  if (currentTitle !== null) {
    sections.set(currentTitle, currentBody.join("\n"));
  }

  return { preamble: preamble.join("\n"), sections };
}

/**
 * Parse the preamble to extract the h1 title and version/status metadata lines.
 * Handles the Structured MADR format which uses bold metadata lines
 * (e.g., **Version:** 1.0.0) rather than YAML frontmatter.
 * Returns { h1Line, metaLines, rest }.
 */
function parsePreamble(preambleText) {
  const lines = preambleText.split("\n");
  let h1Line = "";
  const metaLines = [];
  const rest = [];
  let foundH1 = false;
  let inMeta = false;

  for (const line of lines) {
    if (!foundH1 && line.startsWith("# ")) {
      h1Line = line;
      foundH1 = true;
      inMeta = true;
      continue;
    }

    // Collect bold metadata lines immediately after the h1
    if (inMeta && line.startsWith("**") && line.includes(":**")) {
      metaLines.push(line);
      continue;
    }

    // Empty lines between h1 and metadata are fine
    if (inMeta && line.trim() === "" && metaLines.length === 0) {
      continue;
    }

    // Once we hit a non-meta, non-empty line, stop collecting meta
    if (inMeta && line.trim() !== "") {
      inMeta = false;
    }

    if (foundH1) {
      rest.push(line);
    }
  }

  return { h1Line, metaLines, rest: rest.join("\n").trim() };
}

/**
 * Apply subsection filter to a section's content.
 * Splits by h3 headings and includes/excludes based on prefix.
 */
function applySubsectionFilter(sectionContent, filter) {
  const lines = sectionContent.split("\n");
  const subsections = [];
  let intro = []; // content before the first h3
  let currentH3Title = null;
  let currentH3Body = [];
  let inCodeFence = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeFence = !inCodeFence;
    }

    if (!inCodeFence && line.startsWith("### ")) {
      if (currentH3Title !== null) {
        subsections.push({
          title: currentH3Title,
          heading: `### ${currentH3Title}`,
          body: currentH3Body.join("\n"),
        });
      }
      currentH3Title = line.slice(4).trim();
      currentH3Body = [];
      continue;
    }

    if (currentH3Title === null) {
      intro.push(line);
    } else {
      currentH3Body.push(line);
    }
  }

  if (currentH3Title !== null) {
    subsections.push({
      title: currentH3Title,
      heading: `### ${currentH3Title}`,
      body: currentH3Body.join("\n"),
    });
  }

  // Apply include/exclude filter
  const result = [];

  if (filter.include) {
    // Include only matching subsections (no intro)
    for (const sub of subsections) {
      const prefix = sub.title.split(" ")[0];
      if (filter.include.includes(prefix)) {
        result.push(sub.heading + "\n" + sub.body);
      }
    }
  } else if (filter.exclude) {
    // Keep intro + non-excluded subsections
    result.push(intro.join("\n"));
    for (const sub of subsections) {
      const prefix = sub.title.split(" ")[0];
      if (filter.exclude.includes(prefix)) {
        if (filter.crossRef && filter.crossRef[prefix]) {
          const bodyLines = sub.body.split("\n");
          const stub = [sub.heading, ""];
          let foundPara = false;
          for (const bl of bodyLines) {
            if (!foundPara && bl.trim() === "") continue;
            if (!foundPara) {
              foundPara = true;
              stub.push(bl);
              continue;
            }
            if (foundPara && bl.trim() === "") break;
            stub.push(bl);
          }
          stub.push("");
          stub.push(filter.crossRef[prefix]);
          result.push(stub.join("\n"));
        }
      } else {
        result.push(sub.heading + "\n" + sub.body);
      }
    }
  }

  return result.join("\n");
}

/**
 * Strip trailing horizontal rule (---) and surrounding blank lines from section body.
 */
function stripTrailingRule(content) {
  return content.replace(/\n---\s*$/, "").trimEnd();
}

/**
 * Promote all markdown headings by one level (## -> #, ### -> ##, etc.)
 * Only promotes headings outside code fences.
 */
function promoteHeadings(content) {
  const lines = content.split("\n");
  let inCodeFence = false;
  const result = [];

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeFence = !inCodeFence;
    }

    if (!inCodeFence && /^#{2,6} /.test(line)) {
      result.push(line.slice(1)); // Remove one '#'
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

/**
 * Rewrite internal anchor links using the cross-references map.
 */
function rewriteLinks(content, crossReferences) {
  return content.replace(/\]\((#[a-z0-9-]+)\)/g, (match, anchor) => {
    if (crossReferences[anchor]) {
      return `](${crossReferences[anchor]})`;
    }
    return match;
  });
}

/**
 * Trim trailing whitespace from each line and ensure exactly one trailing newline.
 */
function normalizeWhitespace(content) {
  const lines = content.split("\n");
  const trimmed = lines.map((l) => l.trimEnd());
  while (trimmed.length > 0 && trimmed[trimmed.length - 1] === "") {
    trimmed.pop();
  }
  return trimmed.join("\n") + "\n";
}

/**
 * Build the Astro YAML frontmatter block.
 */
function buildFrontmatter(page) {
  const lines = ["---"];
  lines.push(`title: "${page.title}"`);
  lines.push(`description: "${page.description}"`);
  lines.push("---");
  return lines.join("\n");
}

/**
 * Generate all MDX pages from the spec.
 * @param {string} outputDir - Override output directory (for freshness checking)
 * @returns {string[]} List of generated file paths
 */
export function generateSpecPages(outputDir) {
  const config = JSON.parse(
    readFileSync(join(__dirname, "spec-mapping.json"), "utf8"),
  );

  const specPath = resolve(ROOT, config.sourceSpec);
  const specText = readFileSync(specPath, "utf8");
  const outDir = outputDir || resolve(ROOT, config.outputDir);

  mkdirSync(outDir, { recursive: true });

  const { preamble, sections } = parseSpec(specText);
  const { h1Line, metaLines } = parsePreamble(preamble);

  const generated = [];
  const unmatchedSections = [];

  for (const page of config.pages) {
    const parts = [];

    // Check which sections exist
    for (const sectionTitle of page.sections) {
      if (!sections.has(sectionTitle)) {
        unmatchedSections.push(
          `${page.output}: section "${sectionTitle}" not found in spec`,
        );
      }
    }

    // For overview page, include the h1 and metadata lines
    if (page.keepPreamble) {
      const preambleBlock = [h1Line, ""];
      for (const ml of metaLines) {
        preambleBlock.push(ml);
      }
      parts.push(preambleBlock.join("\n"));
    }

    // Collect matching sections
    let sectionIndex = 0;
    for (const sectionTitle of page.sections) {
      let content = sections.get(sectionTitle);
      if (content === undefined) continue;

      // Strip trailing --- from section body
      content = stripTrailingRule(content);

      // Apply subsection filter if configured for this section
      if (
        page.subsectionFilter &&
        page.subsectionFilter.section === sectionTitle
      ) {
        content = applySubsectionFilter(content, page.subsectionFilter);
      }

      // Build section content with its h2 heading
      const includeParentHeading = !(
        page.subsectionFilter &&
        page.subsectionFilter.section === sectionTitle &&
        page.subsectionFilter.include
      );
      const sectionBlock = includeParentHeading
        ? `## ${sectionTitle}\n${content}`
        : content;

      // Add separator between sections (not before first section)
      if (sectionIndex > 0) {
        parts.push("---");
      }
      parts.push(sectionBlock);
      sectionIndex++;
    }

    let body = parts.join("\n\n");

    // Promote headings for non-overview pages
    if (!page.keepPreamble) {
      body = promoteHeadings(body);
    }

    // Rewrite cross-page links
    body = rewriteLinks(body, config.crossReferences);

    // Build final file content
    const frontmatter = buildFrontmatter(page);
    const fileContent = normalizeWhitespace(frontmatter + "\n\n" + body);

    // Write file
    const filePath = join(outDir, page.output);
    writeFileSync(filePath, fileContent, "utf8");
    generated.push(filePath);
  }

  // Report results
  console.log(`Generated ${generated.length} files:`);
  for (const f of generated) {
    console.log(`  ${f}`);
  }

  if (unmatchedSections.length > 0) {
    console.warn(
      `\nWarnings (${unmatchedSections.length} unmatched sections):`,
    );
    for (const w of unmatchedSections) {
      console.warn(`  ${w}`);
    }
  }

  return generated;
}

// Run if invoked directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSpecPages();
}
