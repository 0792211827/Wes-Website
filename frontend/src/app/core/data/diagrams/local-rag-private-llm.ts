import type { Diagram } from './index';

export const LOCAL_DIAGRAMS: Record<string, Diagram> = {
  'local-request-flow': {
    title: 'Request path',
    caption:
      'One question from input to cited answer, with every stage inside the private network: guardrails on the way in, retrieval, generation on vLLM, and guardrails on the way out.',
    steps: [
      'A question comes in through the app or API',
      'Input guardrails check for PII and prompt injection',
      'The question is embedded as one vector',
      'Vector search returns the top 20, filtered by access rights',
      'The prompt is assembled from the retrieved passages',
      'vLLM generates the answer on the private GPU',
      'Output guardrails check for PII and grounding',
      'The answer is returned with citations to document and page'
    ],
    viewBox: '0 40 760 260',
    svg: `<defs><marker id="local-request-flow-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="dg-head" d="M0 0 8 4 0 8z"/></marker><marker id="local-request-flow-arr-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="dg-head-a" d="M0 0 8 4 0 8z"/></marker></defs>
<text class="dg-n" x="26" y="66">01</text>
<rect class="dg-box-a" data-step="1" x="26" y="76" width="156" height="56" rx="6"/>
<text class="dg-t" x="104" y="100" text-anchor="middle">User question</text>
<text class="dg-s" x="104" y="118" text-anchor="middle">via app / API</text>
<text class="dg-n" x="210" y="66">02</text>
<rect class="dg-box-w" data-step="2" x="210" y="76" width="156" height="56" rx="6"/>
<text class="dg-t" x="288" y="100" text-anchor="middle">Input guardrails</text>
<text class="dg-s" x="288" y="118" text-anchor="middle">PII, injection</text>
<text class="dg-n" x="394" y="66">03</text>
<rect class="dg-box-v" data-step="3" x="394" y="76" width="156" height="56" rx="6"/>
<text class="dg-t" x="472" y="100" text-anchor="middle">Embed query</text>
<text class="dg-s" x="472" y="118" text-anchor="middle">bge-m3, 1 vector</text>
<text class="dg-n" x="578" y="66">04</text>
<rect class="dg-box-s" data-step="4" x="578" y="76" width="156" height="56" rx="6"/>
<text class="dg-t" x="656" y="100" text-anchor="middle">Vector search</text>
<text class="dg-s" x="656" y="118" text-anchor="middle">top-20, ACL filter</text>
<path class="dg-flow" data-step="2" d="M182 104 H208" marker-end="url(#local-request-flow-arr-a)"/>
<path class="dg-flow" data-step="3" d="M366 104 H392" marker-end="url(#local-request-flow-arr-a)"/>
<path class="dg-flow" data-step="4" d="M550 104 H576" marker-end="url(#local-request-flow-arr-a)"/>
<path class="dg-flow" data-step="5" d="M720 132 V218" marker-end="url(#local-request-flow-arr-a)"/>
<text class="dg-n" x="578" y="210">05</text>
<rect class="dg-box" data-step="5" x="578" y="220" width="156" height="56" rx="6"/>
<text class="dg-t" x="656" y="244" text-anchor="middle">Prompt assembly</text>
<text class="dg-s" x="656" y="262" text-anchor="middle">≤ 6,168 ctx tokens</text>
<text class="dg-n" x="394" y="210">06</text>
<rect class="dg-box-v" data-step="6" x="394" y="220" width="156" height="56" rx="6"/>
<text class="dg-t" x="472" y="244" text-anchor="middle">vLLM generate</text>
<text class="dg-s" x="472" y="262" text-anchor="middle">prefill + stream</text>
<text class="dg-n" x="210" y="210">07</text>
<rect class="dg-box-w" data-step="7" x="210" y="220" width="156" height="56" rx="6"/>
<text class="dg-t" x="288" y="244" text-anchor="middle">Output guardrails</text>
<text class="dg-s" x="288" y="262" text-anchor="middle">PII, grounding</text>
<text class="dg-n" x="26" y="210">08</text>
<rect class="dg-box-a" data-step="8" x="26" y="220" width="156" height="56" rx="6"/>
<text class="dg-t" x="104" y="244" text-anchor="middle">Cited answer</text>
<text class="dg-s" x="104" y="262" text-anchor="middle">[n] → doc, page</text>
<path class="dg-flow" data-step="6" d="M578 248 H552" marker-end="url(#local-request-flow-arr-a)"/>
<path class="dg-flow" data-step="7" d="M394 248 H368" marker-end="url(#local-request-flow-arr-a)"/>
<path class="dg-flow" data-step="8" d="M210 248 H184" marker-end="url(#local-request-flow-arr-a)"/>`
  }
};
