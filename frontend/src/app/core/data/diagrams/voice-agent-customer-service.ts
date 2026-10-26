import type { Diagram } from './index';

export const VOICE_DIAGRAMS: Record<string, Diagram> = {
  'voice-architecture': {
    title: 'Architecture',
    caption:
      'Caller audio flows through the orchestrator to streaming STT and the LLM, and the reply streams through ElevenLabs back to the caller as μ-law audio. Tool calls pass through the policy layer before reaching business systems; dashed lines are traces and the handoff path.',
    steps: [
      'Caller audio arrives over PSTN / SIP',
      'Telephony streams the audio frames to the orchestrator',
      'Streaming STT returns partial and final transcripts',
      'The LLM takes the turn and decides: reply or tool call',
      'A tool call goes to the policy layer first',
      'Verified calls run against business systems, with timeouts',
      'The reply streams to ElevenLabs; μ-law audio goes back to the caller',
      'Every stage writes its timings to the trace store',
      'When it cannot help: warm transfer to a human, with a call summary'
    ],
    viewBox: '0 0 760 512',
    svg: `<defs>
<marker id="voice-architecture-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="dg-head" d="M0 0 8 4 0 8z"/></marker>
<marker id="voice-architecture-arr-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path class="dg-head-a" d="M0 0 8 4 0 8z"/></marker>
</defs>
<rect class="dg-zone" x="168" y="36" width="424" height="344" rx="6"/>
<text class="dg-z" x="580" y="370" text-anchor="end">agent service · one region</text>
<rect class="dg-zone" x="168" y="400" width="424" height="96" rx="6"/>
<text class="dg-z" x="580" y="416" text-anchor="end">business systems</text>

<rect class="dg-box" data-step="1" x="24" y="60" width="120" height="48" rx="6"/>
<text class="dg-t" x="84" y="82" text-anchor="middle">Caller</text>
<text class="dg-s" x="84" y="98" text-anchor="middle">phone</text>
<path class="dg-flow" data-step="1" d="M84 108 V170" marker-start="url(#voice-architecture-arr-a)" marker-end="url(#voice-architecture-arr-a)"/>
<text class="dg-s" x="92" y="143">PSTN / SIP</text>

<rect class="dg-box-a" data-step="1" x="24" y="170" width="120" height="56" rx="6"/>
<text class="dg-t" x="84" y="193" text-anchor="middle">Telephony</text>
<text class="dg-s" x="84" y="211" text-anchor="middle">Media Streams</text>
<path class="dg-flow" data-step="2" d="M144 198 H188" marker-start="url(#voice-architecture-arr-a)" marker-end="url(#voice-architecture-arr-a)"/>

<rect class="dg-box-a" data-step="2" x="188" y="170" width="176" height="56" rx="6"/>
<text class="dg-t" x="276" y="193" text-anchor="middle">Orchestrator</text>
<text class="dg-s" x="276" y="211" text-anchor="middle">VAD · turns · barge-in</text>

<rect class="dg-box-v" data-step="3" x="396" y="64" width="176" height="52" rx="6"/>
<text class="dg-t" x="484" y="86" text-anchor="middle">Streaming STT</text>
<text class="dg-s" x="484" y="103" text-anchor="middle">partials + finals</text>
<path class="dg-flow" data-step="3" d="M364 184 H380 V90 H396" marker-start="url(#voice-architecture-arr-a)" marker-end="url(#voice-architecture-arr-a)"/>

<rect class="dg-box-v" data-step="4" x="396" y="170" width="176" height="56" rx="6"/>
<text class="dg-t" x="484" y="193" text-anchor="middle">LLM</text>
<text class="dg-s" x="484" y="211" text-anchor="middle">function calling</text>
<path class="dg-flow" data-step="4" d="M364 206 H396" marker-start="url(#voice-architecture-arr-a)" marker-end="url(#voice-architecture-arr-a)"/>

<rect class="dg-box-v" data-step="7" x="612" y="170" width="128" height="56" rx="6"/>
<text class="dg-t" x="676" y="193" text-anchor="middle">ElevenLabs</text>
<text class="dg-s" x="676" y="211" text-anchor="middle">TTS · WebSocket</text>
<path class="dg-flow" data-step="7" d="M572 198 H612" marker-end="url(#voice-architecture-arr-a)"/>
<path class="dg-flow" data-step="7" d="M676 170 V48 H300 V170" marker-end="url(#voice-architecture-arr-a)"/>
<text class="dg-s" x="684" y="106">audio</text>
<text class="dg-s" x="684" y="120">μ-law</text>

<rect class="dg-box-w" data-step="5" x="396" y="280" width="176" height="56" rx="6"/>
<text class="dg-t" x="484" y="303" text-anchor="middle">Policy layer</text>
<text class="dg-s" x="484" y="321" text-anchor="middle">verify · validate</text>
<path class="dg-line" data-step="5" d="M484 226 V280" marker-end="url(#voice-architecture-arr)"/>
<text class="dg-s" x="492" y="257">tool call</text>

<rect class="dg-box" data-step="6" x="188" y="280" width="176" height="56" rx="6"/>
<text class="dg-t" x="276" y="303" text-anchor="middle">Tool executor</text>
<text class="dg-s" x="276" y="321" text-anchor="middle">timeouts · idempotency</text>
<path class="dg-line" data-step="6" d="M396 308 H364" marker-end="url(#voice-architecture-arr)"/>
<path class="dg-line" data-step="6" d="M276 336 V428" marker-start="url(#voice-architecture-arr)" marker-end="url(#voice-architecture-arr)"/>

<rect class="dg-box-s" data-step="6" x="184" y="428" width="124" height="52" rx="6"/>
<text class="dg-t" x="246" y="450" text-anchor="middle">Accounts</text>
<text class="dg-s" x="246" y="467" text-anchor="middle">CRM API</text>
<rect class="dg-box-s" data-step="6" x="318" y="428" width="124" height="52" rx="6"/>
<text class="dg-t" x="380" y="450" text-anchor="middle">Orders</text>
<text class="dg-s" x="380" y="467" text-anchor="middle">bookings API</text>
<rect class="dg-box-s" data-step="6" x="452" y="428" width="124" height="52" rx="6"/>
<text class="dg-t" x="514" y="450" text-anchor="middle">Tickets</text>
<text class="dg-s" x="514" y="467" text-anchor="middle">case API</text>

<rect class="dg-box-s" data-step="8" x="612" y="290" width="128" height="52" rx="6"/>
<text class="dg-t" x="676" y="312" text-anchor="middle">Trace store</text>
<text class="dg-s" x="676" y="328" text-anchor="middle">stage timings</text>
<path class="dg-dash" data-step="8" d="M572 316 H612" marker-end="url(#voice-architecture-arr)"/>

<rect class="dg-box" data-step="9" x="24" y="290" width="120" height="56" rx="6"/>
<text class="dg-t" x="84" y="313" text-anchor="middle">Human agent</text>
<text class="dg-s" x="84" y="331" text-anchor="middle">warm transfer</text>
<path class="dg-dash" data-step="9" d="M84 226 V290" marker-end="url(#voice-architecture-arr)"/>
<text class="dg-s" x="92" y="262">transfer</text>
<path class="dg-dash" data-step="9" d="M188 216 H160 V318 H144" marker-end="url(#voice-architecture-arr)"/>
<text class="dg-s" x="84" y="366" text-anchor="middle">call summary</text>`
  }
};
