---
description: Scaffold a new AI Lab experiment MDX file with frontmatter and required sections
argument-hint: [slug]
---

Create a new experiment write-up at `src/content/lab/$1.mdx`.

If `$1` is empty, ask for the slug first. Reject anything that is not
lowercase kebab-case. If the file already exists, stop and say so.

Write exactly this, filling only `slug` and leaving everything else as a TODO.
Do not invent content — delegate the writing to `lab-experiment-writer`.

Use **today's actual date** for `date` — not a `TODO` marker. The frontmatter
schema requires a real `YYYY-MM-DD` value, and one invalid file fails the whole
collection, which would break the index page, every sibling detail page and the
sitemap until it is fixed. The author can correct the date before publishing.

```mdx
---
title: "TODO"
slug: "$1"
description: "TODO: one sentence"
date: "<today, YYYY-MM-DD>"
category: "TODO"
tags: []
featured: false
# Optional — delete any line that does not apply. Only set github/demo if a
# real public URL exists.
# image: "/images/TODO.png"
# github: "https://github.com/..."
# demo: "https://..."
---

## Hypothesis

<!-- TODO: what question this experiment set out to answer -->

## Setup

<!-- TODO: approach, tools, data -->

## What Happened

<!-- TODO: including negative results -->

## Findings

<!-- TODO: measured, not asserted -->

## Limitations

<!-- TODO -->

## Next Steps

<!-- TODO -->

## Resources

<!-- TODO -->
```

<!-- TODO: reconcile this section list against docs/requirements.md once the
     spec is available. -->

Then confirm the path created.
