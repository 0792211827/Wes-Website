import type { Diagram } from './index';

export const DOC_DIAGRAMS: Record<string, Diagram> = {
  'doc-ingestion': {
    title: 'Ingestion pipeline',
    caption:
      'Each file is hashed, then each page is classified as native or scanned. Both paths go through the layout model before cleaning and chunking, and every chunk is written to both indexes under one chunk_id that the metadata store tracks.',
    steps: [
      'Files and scans arrive',
      'Each file is hashed and checked against known versions',
      'Each page is classified as native or scanned',
      'Native pages are parsed directly; scanned pages go through OCR',
      'Both paths go through the layout model; low-confidence OCR goes to review',
      'Headers and footers are stripped',
      'Clean text is split into parent and child chunks',
      'Each chunk is embedded and analysed for keyword search',
      'Both indexes and the metadata store share one chunk_id'
    ],
    viewBox: '0 0 760 490',
    svg: `<defs><marker id="doc-ingestion-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="dg-head" d="M0 0 8 4 0 8z"/></marker><marker id="doc-ingestion-arr-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="dg-head-a" d="M0 0 8 4 0 8z"/></marker></defs>
<rect class="dg-box" data-step="1" x="20" y="76" width="110" height="48" rx="6"/>
<text class="dg-t" x="75" y="96" text-anchor="middle">Sources</text>
<text class="dg-s" x="75" y="113" text-anchor="middle">files + scans</text>
<rect class="dg-box" data-step="2" x="150" y="76" width="130" height="48" rx="6"/>
<text class="dg-t" x="215" y="96" text-anchor="middle">Hash + dedupe</text>
<text class="dg-s" x="215" y="113" text-anchor="middle">sha256, version</text>
<rect class="dg-box-a" data-step="3" x="300" y="76" width="130" height="48" rx="6"/>
<text class="dg-t" x="365" y="96" text-anchor="middle">Page classify</text>
<text class="dg-s" x="365" y="113" text-anchor="middle">native | scanned</text>
<text class="dg-w" x="365" y="142" text-anchor="middle">chars &lt; 50 → OCR</text>
<rect class="dg-box" data-step="4" x="454" y="40" width="130" height="48" rx="6"/>
<text class="dg-t" x="519" y="60" text-anchor="middle">Text layer</text>
<text class="dg-s" x="519" y="77" text-anchor="middle">parse directly</text>
<rect class="dg-box-v" data-step="4" x="454" y="112" width="130" height="48" rx="6"/>
<text class="dg-t" x="519" y="132" text-anchor="middle">OCR</text>
<text class="dg-s" x="519" y="149" text-anchor="middle">300 DPI, conf</text>
<rect class="dg-box-v" data-step="5" x="608" y="76" width="136" height="48" rx="6"/>
<text class="dg-t" x="676" y="96" text-anchor="middle">Layout model</text>
<text class="dg-s" x="676" y="113" text-anchor="middle">reading order</text>
<line class="dg-flow" data-step="2" x1="130" y1="100" x2="150" y2="100" marker-end="url(#doc-ingestion-arr-a)"/>
<line class="dg-flow" data-step="3" x1="280" y1="100" x2="300" y2="100" marker-end="url(#doc-ingestion-arr-a)"/>
<line class="dg-flow" data-step="4" x1="430" y1="100" x2="454" y2="64" marker-end="url(#doc-ingestion-arr-a)"/>
<line class="dg-flow" data-step="4" x1="430" y1="100" x2="454" y2="136" marker-end="url(#doc-ingestion-arr-a)"/>
<line class="dg-flow" data-step="5" x1="584" y1="64" x2="608" y2="92" marker-end="url(#doc-ingestion-arr-a)"/>
<line class="dg-flow" data-step="5" x1="584" y1="136" x2="608" y2="108" marker-end="url(#doc-ingestion-arr-a)"/>
<rect class="dg-box-w" data-step="5" x="236" y="200" width="160" height="48" rx="6"/>
<text class="dg-t" x="316" y="220" text-anchor="middle">Review queue</text>
<text class="dg-s" x="316" y="237" text-anchor="middle">OCR conf &lt; 70</text>
<line class="dg-dash" data-step="5" x1="470" y1="160" x2="370" y2="200" marker-end="url(#doc-ingestion-arr)"/>
<rect class="dg-box-a" data-step="7" x="432" y="200" width="140" height="48" rx="6"/>
<text class="dg-t" x="502" y="220" text-anchor="middle">Chunker</text>
<text class="dg-s" x="502" y="237" text-anchor="middle">parent / child</text>
<rect class="dg-box-a" data-step="6" x="608" y="200" width="136" height="48" rx="6"/>
<text class="dg-t" x="676" y="220" text-anchor="middle">Clean</text>
<text class="dg-s" x="676" y="237" text-anchor="middle">strip hdr/ftr</text>
<line class="dg-flow" data-step="6" x1="676" y1="124" x2="676" y2="200" marker-end="url(#doc-ingestion-arr-a)"/>
<line class="dg-flow" data-step="7" x1="608" y1="224" x2="572" y2="224" marker-end="url(#doc-ingestion-arr-a)"/>
<rect class="dg-box-v" data-step="8" x="360" y="300" width="130" height="48" rx="6"/>
<text class="dg-t" x="425" y="320" text-anchor="middle">Embed</text>
<text class="dg-s" x="425" y="337" text-anchor="middle">bge-m3, 1024-d</text>
<rect class="dg-box" data-step="8" x="523" y="300" width="130" height="48" rx="6"/>
<text class="dg-t" x="588" y="320" text-anchor="middle">BM25 analyze</text>
<text class="dg-s" x="588" y="337" text-anchor="middle">tokenise, stem</text>
<line class="dg-flow" data-step="8" x1="480" y1="248" x2="425" y2="300" marker-end="url(#doc-ingestion-arr-a)"/>
<line class="dg-flow" data-step="8" x1="524" y1="248" x2="588" y2="300" marker-end="url(#doc-ingestion-arr-a)"/>
<rect class="dg-zone" x="28" y="372" width="644" height="100" rx="6"/>
<text class="dg-z" x="40" y="462">Stores, keyed by chunk_id</text>
<rect class="dg-box-s" data-step="9" x="40" y="400" width="170" height="48" rx="6"/>
<text class="dg-t" x="125" y="420" text-anchor="middle">Metadata store</text>
<text class="dg-s" x="125" y="437" text-anchor="middle">docs, chunks, state</text>
<rect class="dg-box-s" data-step="9" x="360" y="400" width="130" height="48" rx="6"/>
<text class="dg-t" x="425" y="420" text-anchor="middle">Vector index</text>
<text class="dg-s" x="425" y="437" text-anchor="middle">HNSW m=16</text>
<rect class="dg-box-s" data-step="9" x="520" y="400" width="136" height="48" rx="6"/>
<text class="dg-t" x="588" y="420" text-anchor="middle">Keyword index</text>
<text class="dg-s" x="588" y="437" text-anchor="middle">BM25 + ids field</text>
<line class="dg-flow" data-step="9" x1="425" y1="348" x2="425" y2="400" marker-end="url(#doc-ingestion-arr-a)"/>
<line class="dg-flow" data-step="9" x1="588" y1="348" x2="588" y2="400" marker-end="url(#doc-ingestion-arr-a)"/>
<line class="dg-dash" data-step="9" x1="170" y1="124" x2="170" y2="400" marker-end="url(#doc-ingestion-arr)"/>
<text class="dg-s" x="178" y="170">known hashes</text>
<line class="dg-dash" data-step="9" x1="360" y1="424" x2="210" y2="424" marker-end="url(#doc-ingestion-arr)"/>
<text class="dg-s" x="285" y="416" text-anchor="middle">chunk_id</text>`
  },
  'doc-query': {
    title: 'Query path',
    caption:
      'Dense and keyword search run in parallel and are fused by rank, then a cross-encoder keeps the best 8. A score gate decides between answering and refusing, and a citation check runs on every answer.',
    steps: [
      'The question arrives with the last 3 turns',
      'It is rewritten as a standalone query',
      'Dense and BM25 search run in parallel',
      'The two result lists are fused by rank',
      'A cross-encoder re-ranks and keeps the best 8',
      'A score gate decides: answer or refuse',
      'The LLM answers with numbered citations',
      'Every citation is checked against its source',
      'The cited answer is returned with page numbers',
      'Low scores, or a citation check that fails twice, end in a refusal'
    ],
    viewBox: '0 0 760 392',
    svg: `<defs><marker id="doc-query-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="dg-head" d="M0 0 8 4 0 8z"/></marker><marker id="doc-query-arr-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="dg-head-a" d="M0 0 8 4 0 8z"/></marker></defs>
<rect class="dg-box" data-step="1" x="20" y="88" width="110" height="48" rx="6"/>
<text class="dg-t" x="75" y="108" text-anchor="middle">Question</text>
<text class="dg-s" x="75" y="125" text-anchor="middle">+ last 3 turns</text>
<rect class="dg-box-v" data-step="2" x="152" y="88" width="130" height="48" rx="6"/>
<text class="dg-t" x="217" y="108" text-anchor="middle">Rewrite</text>
<text class="dg-s" x="217" y="125" text-anchor="middle">standalone + ids</text>
<rect class="dg-box-s" data-step="3" x="310" y="40" width="146" height="48" rx="6"/>
<text class="dg-t" x="383" y="60" text-anchor="middle">Dense top-50</text>
<text class="dg-s" x="383" y="77" text-anchor="middle">HNSW, ef=128</text>
<rect class="dg-box-s" data-step="3" x="310" y="136" width="146" height="48" rx="6"/>
<text class="dg-t" x="383" y="156" text-anchor="middle">BM25 top-50</text>
<text class="dg-s" x="383" y="173" text-anchor="middle">text + ids fields</text>
<rect class="dg-box-a" data-step="4" x="484" y="88" width="110" height="48" rx="6"/>
<text class="dg-t" x="539" y="108" text-anchor="middle">RRF k=60</text>
<text class="dg-s" x="539" y="125" text-anchor="middle">+ live check</text>
<rect class="dg-box-v" data-step="5" x="618" y="88" width="126" height="48" rx="6"/>
<text class="dg-t" x="681" y="108" text-anchor="middle">Re-ranker</text>
<text class="dg-s" x="681" y="125" text-anchor="middle">50 → top 8</text>
<line class="dg-flow" data-step="2" x1="130" y1="112" x2="152" y2="112" marker-end="url(#doc-query-arr-a)"/>
<line class="dg-flow" data-step="3" x1="282" y1="112" x2="310" y2="64" marker-end="url(#doc-query-arr-a)"/>
<line class="dg-flow" data-step="3" x1="282" y1="112" x2="310" y2="160" marker-end="url(#doc-query-arr-a)"/>
<line class="dg-flow" data-step="4" x1="456" y1="64" x2="484" y2="100" marker-end="url(#doc-query-arr-a)"/>
<line class="dg-flow" data-step="4" x1="456" y1="160" x2="484" y2="124" marker-end="url(#doc-query-arr-a)"/>
<line class="dg-flow" data-step="5" x1="594" y1="112" x2="618" y2="112" marker-end="url(#doc-query-arr-a)"/>
<rect class="dg-box-w" data-step="6" x="604" y="240" width="140" height="48" rx="6"/>
<text class="dg-t" x="674" y="260" text-anchor="middle">Score gate</text>
<text class="dg-s" x="674" y="277" text-anchor="middle">top ≥ τ</text>
<line class="dg-flow" data-step="6" x1="674" y1="136" x2="674" y2="240" marker-end="url(#doc-query-arr-a)"/>
<rect class="dg-box-v" data-step="7" x="372" y="240" width="200" height="48" rx="6"/>
<text class="dg-t" x="472" y="260" text-anchor="middle">LLM + citations</text>
<text class="dg-s" x="472" y="277" text-anchor="middle">sources [S1]..[S8]</text>
<line class="dg-flow" data-step="7" x1="604" y1="264" x2="572" y2="264" marker-end="url(#doc-query-arr-a)"/>
<text class="dg-s" x="588" y="256" text-anchor="middle">yes</text>
<rect class="dg-box-w" data-step="8" x="176" y="240" width="172" height="48" rx="6"/>
<text class="dg-t" x="262" y="260" text-anchor="middle">Citation check</text>
<text class="dg-s" x="262" y="277" text-anchor="middle">ids + numbers</text>
<line class="dg-flow" data-step="8" x1="372" y1="264" x2="348" y2="264" marker-end="url(#doc-query-arr-a)"/>
<rect class="dg-box-a" data-step="9" x="20" y="240" width="130" height="48" rx="6"/>
<text class="dg-t" x="85" y="260" text-anchor="middle">Answer</text>
<text class="dg-s" x="85" y="277" text-anchor="middle">cited, pages</text>
<line class="dg-flow" data-step="9" x1="176" y1="264" x2="150" y2="264" marker-end="url(#doc-query-arr-a)"/>
<rect class="dg-box" data-step="10" x="604" y="330" width="140" height="48" rx="6"/>
<text class="dg-t" x="674" y="350" text-anchor="middle">Refuse</text>
<text class="dg-s" x="674" y="367" text-anchor="middle">closest 3 passages</text>
<line class="dg-dash" data-step="10" x1="674" y1="288" x2="674" y2="330" marker-end="url(#doc-query-arr)"/>
<text class="dg-s" x="684" y="314">no</text>
<path class="dg-dash" data-step="10" d="M262 288 V354 H604" marker-end="url(#doc-query-arr)"/>
<text class="dg-w" x="272" y="346">check fails twice</text>`
  }
};
