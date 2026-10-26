/*
 * Architecture diagrams embedded in case-study write-ups with a line `[[diagram:key]]`.
 * They are inline SVG drawn with the `dg-*` classes in styles.css, so they follow the light/dark theme.
 * Only bundled code defines diagrams; content from the API can reference a key but never supply SVG.
 * Diagrams with `steps` play as an animation: elements tagged `data-step="n"` (1-based, space-separated
 * for more than one step) light up in order, and a packet travels along that step's connectors.
 */
export interface Diagram {
  title: string;
  /** One or two sentences under the figure; also used as the SVG's accessible description. */
  caption: string;
  /** One short label per animation step; `steps[0]` describes the elements tagged `data-step="1"`. */
  steps?: string[];
  viewBox: string;
  /** SVG markup without the outer <svg> element. */
  svg: string;
}

import { DOC_DIAGRAMS } from './document-intelligence-retrieval';
import { LOCAL_DIAGRAMS } from './local-rag-private-llm';
import { VOICE_DIAGRAMS } from './voice-agent-customer-service';

export const DIAGRAMS: Record<string, Diagram> = { ...VOICE_DIAGRAMS, ...DOC_DIAGRAMS, ...LOCAL_DIAGRAMS };
