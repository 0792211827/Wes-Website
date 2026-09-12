---
description: Scaffold a new article MDX file with frontmatter
argument-hint: [slug]
---

Create a new article at `src/content/blog/$1.mdx`.

If `$1` is empty, ask for the slug first. Reject anything that is not
lowercase kebab-case. If the file already exists, stop and say so.

Write exactly this, filling only `slug` and leaving everything else as a TODO.
Do not invent content — delegate the writing to `blog-writer`.

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
# Optional — delete any line that does not apply.
# image: "/images/TODO.png"
---

<!-- TODO: article body. Lead with the argument, not a preamble. -->
```

Then confirm the path created and remind the author that the filename must stay
in sync with the `slug` field.
