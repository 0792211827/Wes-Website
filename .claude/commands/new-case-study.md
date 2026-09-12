---
description: Scaffold a new case study MDX file with frontmatter and required sections
argument-hint: [slug]
---

Create a new case study at `src/content/case-studies/$1.mdx`.

If `$1` is empty, ask for the slug first. Reject anything that is not
lowercase kebab-case. If the file already exists, stop and say so.

Write exactly this, filling only `slug`, and leaving every other frontmatter
value and every section body as a TODO for the author. Do not invent content —
delegate the actual writing to the `case-study-writer` agent afterwards.

Use **today's actual date** for `date` — not a `TODO` marker. The frontmatter
schema requires a real `YYYY-MM-DD` value, and one invalid file fails the whole
collection, which would break the index page, every sibling detail page and the
sitemap until it is fixed. The author can correct the date before publishing.

```mdx
---
title: "TODO"
slug: "$1"
description: "TODO: one sentence, used in cards and search results"
date: "<today, YYYY-MM-DD>"
category: "TODO"
tags: []
featured: false
# Optional — delete any line that does not apply. Do not guess values.
# image: "/images/TODO.png"
# github: "https://github.com/..."
# demo: "https://..."
---

## Overview

<!-- TODO -->

## Problem

<!-- TODO -->

## Business Context

<!-- TODO -->

## Requirements

<!-- TODO -->

## Architecture

<!-- TODO -->

## Implementation

<!-- TODO -->

## Challenges

<!-- TODO -->

## Tradeoffs

<!-- TODO -->

## Evaluation

<!-- TODO -->

## Results

<!-- TODO: real, verifiable outcomes only. Leave empty if none are shareable. -->

## Lessons

<!-- TODO -->

## Resources

<!-- TODO -->
```

Then confirm the path created and remind the author that the filename must stay
in sync with the `slug` field.
