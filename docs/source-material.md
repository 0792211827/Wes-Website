# Source material

CLAUDE.md §2 requires every claim about Wesley's work to be traceable to real
content. This file records what the current site copy is traceable *to*, so a
later session can check a claim without guessing.

## Provenance

Primary source: `Wesley_Nyamosi_Resume.pdf` (provided 12 September 2026).
The file is **gitignored** — it carries a personal phone number and must not be
committed. Keep it out of `public/` too.

## Facts the copy relies on

- BSc Statistics, Jomo Kenyatta University of Agriculture and Technology,
  Sep 2019 – Dec 2023.
- Data Analyst Intern, NITA, Kenya, Jan 2023 – Apr 2023. Built and deployed ML
  models for operational decisions; integrated external data APIs to automate
  ingestion; authored technical reports for stakeholders.
- Data Science Intern, Forage, Remote, Jun 2024 – Aug 2024. Predictive models
  for customer booking behaviour; sentiment analysis of customer reviews;
  data preprocessing workflows; Git-based reproducibility.
- Skills: Python, R, SQL; Git, GitHub, Jupyter, VS Code, Docker, Colab;
  TensorFlow, PyTorch, scikit-learn, Pandas, NumPy, Matplotlib, Seaborn,
  Tableau, Power BI, Streamlit, Flask; MLflow, Hugging Face, FastAPI.
- Certifications: DataCamp (Intro to Data Science in Python, Intermediate
  Python); Coursera (MLOps Tools: MLflow and Hugging Face, Advanced Learning
  Algorithms).
- Contact: nyamosiwesley02@gmail.com,
  linkedin.com/in/wesley-nyamosi-809409251.

- **AI engineering focus areas** — CONFIRMED by Wesley in session on
  2026-10-24: he builds hands-on with AI agents and RAG (including evaluation
  harnesses), open-weight LLMs deployed locally, and inference engines such as
  vLLM and Ollama. The home page "AI Engineering" cards, hero tags and support
  line rely on this. It is a statement of what he works with, not a claim of
  production deployments, clients or metrics.

- **Agent tooling** — CONFIRMED by Wesley on 2026-10-25: retrieval, evaluation,
  agent harnesses and OpenClaw are part of his agents/RAG work (home card tags).
- **Strategy, cost saving and consulting** — CONFIRMED by Wesley on 2026-10-25
  ("I also do that"). The home card describes the kind of help (where AI is
  worth it, hosted vs self-hosted, predictable inference cost). It names no
  clients, engagements, savings figures or pricing; those stay unsourced.
- **Links** — CONFIRMED by Wesley on 2026-10-25: X https://x.com/nyamosiW,
  GitHub https://github.com/0792211827. The GitHub username is the same digits
  as the phone number on his CV; Wesley was told and chose to publish it as is.
- **Case studies** — CONFIRMED by Wesley on 2026-10-25 from his own briefs:
  (a) a customer-service voice agent with tool calling, ElevenLabs speech and
  voice cloning, built around latency; (b) document intelligence and retrieval;
  (c) local RAG: provisioning GPU infrastructure as a VM, deploying vLLM, loading
  an open-weight model, building the embedding/retrieval pipeline, then
  guardrails and an evaluation pipeline, for enterprises with data or regulatory
  constraints. All three were **built for an employer/client**, who stays unnamed.
  Only vLLM and ElevenLabs are confirmed tools; everything else is described by role.
  The architecture and walkthrough detail is a technical write-up of those briefs.
- **Case-study figures are reference targets, not measurements.** Wesley has no
  measured numbers and asked for standard reference figures. Every number in
  `metric`, `results` and the walkthrough stats is labelled as a target or
  reference value. Never relabel one as an achieved outcome; replace with real
  measurements if Wesley provides them.
- **Case-study deep dives are reference designs.** On 2026-10-25 Wesley asked for
  much more technical write-ups and chose "reference design" over supplying his
  exact stack. Each `body` opens with a "Reference stack" section stating that
  named tools are standard choices for the design, not a record of what was
  deployed. Only vLLM (local RAG) and ElevenLabs (voice) are confirmed. Replace
  reference choices with the real stack as Wesley supplies it, and drop the
  disclaimer once a write-up is fully sourced.

- **Ask-AI knowledge base** (`SeedData.knowledge()` / `KNOWLEDGE`) — rewritten 2026-10-26 to use only
  the facts above: focus areas, consulting (no specifics), the three case studies, CV skills, education and
  internships. Consulting answers say scope depends on the problem; they name no process, durations or pricing.

## Deliberately NOT used

- **The two CV projects** (Spacy Custom Location Mention Recognition; Investor
  Risk Tolerance & Robo-Advisor). Wesley marked these outdated on
  12 September 2026 and is replacing them. Do not reference them, and do not
  reintroduce them as case studies.
- **The CV's percentage metrics** (e.g. "improved accuracy by 30%"). They are
  internship self-reports with no published artefact behind them. The brand
  voice is "show evidence, don't assert authority" (CLAUDE.md §2), so the copy
  describes the work without leaning on unverifiable numbers. If Wesley wants
  them, they should land in a case study that shows the working.
- **Phone number.** Not published; email and LinkedIn are enough.
- **nyamosi.carrd.co.** The old personal site this one replaces.

## Framing rules that came out of review

- **NITA was during the degree, not after it.** Jan–Apr 2023 precedes the
  Dec 2023 graduation. Any copy phrased as "since graduating…" is wrong.
- **Both roles were internships.** Do not drop "intern" — "I worked as a data
  analyst" plus a post-graduation frame reads as years of professional practice
  and is the §2 line about inventing experience.
- **Do not write "in production" as a description of Wesley's own work.** The
  north star (CLAUDE.md §2) is a stated value, not a claim of deployed systems.
  Four strings said this and were softened on 2026-09-12.
- **"Based in Kenya"** (bio.mdx) is CONFIRMED. It is not on the CV — Wesley
  confirmed it directly on 2026-09-12. Do not re-flag it as unsourced.
- **Forage** is a virtual work-experience platform. The CV calls the role
  "Data Science Intern", so the copy does too — but do not upgrade it to an
  employer relationship without checking.

## Still unsourced — do not invent

- Consulting specifics: engagement shapes, deliverables, pricing, past clients
  or savings achieved. Only the fact that he offers strategy / cost / consulting
  help is confirmed (above).
- Anything implying production systems at scale, paid client engagements, or
  testimonials.
- CV download, production domain, OG image.
