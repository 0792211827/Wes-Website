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

- Consulting services (`src/config/services.ts` is still empty). Nothing in the
  CV describes an offering, engagement shape or deliverables.
- Anything implying production systems at scale, paid client engagements, or
  testimonials.
- GitHub profile URL, CV download, production domain, OG image.
