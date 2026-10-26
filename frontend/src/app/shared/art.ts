/* SVG illustrations, generated from content (trusted strings: every label is escaped). */
import { esc, pad2 } from '../core/util';

export function workArt(t: string): string {
  const S = (inner: string) => '<svg class="art draw-ready" viewBox="0 0 200 140" aria-hidden="true">' + inner + '</svg>';
  if (t === 'rag') return S(
    '<rect class="p" x="12" y="30" width="42" height="54" rx="3"/><rect class="p" x="18" y="24" width="42" height="54" rx="3"/><rect class="p" x="24" y="18" width="42" height="54" rx="3"/>' +
    '<path class="l" d="M31 30h28M31 38h20M31 46h25M31 54h16"/>' +
    '<path class="a flow-edge" d="M70 45h22"/>' +
    '<circle class="m" cx="104" cy="34" r="2"/><circle class="m" cx="118" cy="28" r="2"/><circle class="m" cx="112" cy="46" r="2"/><circle class="m" cx="126" cy="40" r="2"/>' +
    '<circle class="m" cx="100" cy="56" r="2"/><circle class="m" cx="122" cy="58" r="2"/><circle class="dot-a" cx="114" cy="38" r="3.2"/><circle class="dot-a" cx="108" cy="50" r="3.2"/>' +
    '<circle class="ring" cx="112" cy="44" r="22"/>' +
    '<path class="a flow-edge" d="M134 56l18 22"/>' +
    '<rect class="f" x="120" y="82" width="68" height="44" rx="4"/><path class="l" d="M128 94h40M128 102h48M128 110h30"/>' +
    '<rect class="t" x="162" y="106" width="9" height="9" rx="2"/><rect class="t" x="174" y="106" width="9" height="9" rx="2"/>');
  if (t === 'doc') return S(
    '<rect class="p" x="18" y="12" width="74" height="116" rx="4"/>' +
    '<path class="l" d="M28 28h50M28 38h42M28 48h54M28 58h36M28 78h50M28 88h44M28 98h52M28 108h30"/>' +
    '<rect class="hl" x="25" y="54" width="46" height="8" rx="1"/><rect class="hl" x="25" y="84" width="52" height="8" rx="1"/>' +
    '<path class="a flow-edge" d="M96 58h22M96 88h22"/>' +
    '<rect class="f" x="122" y="40" width="64" height="26" rx="4"/><rect class="f" x="122" y="74" width="64" height="26" rx="4"/><rect class="p" x="122" y="108" width="64" height="20" rx="4"/>' +
    '<path class="l" d="M130 50h26M130 58h18M130 84h30M130 92h16M130 118h22"/>' +
    '<path class="a" d="m168 52 4 4 8-8M168 86l4 4 8-8"/><circle class="warn" cx="176" cy="118" r="4"/>');
  if (t === 'voice') {
    const hs = [8, 14, 22, 12, 30, 44, 36, 58, 40, 64, 48, 30, 52, 36, 22, 40, 26, 14, 20, 10, 6];
    let bars = '';
    hs.forEach((h, i) => { bars += '<rect class="' + (i > 5 && i < 15 ? 'bar-a' : 'bar-m') + '" x="' + (22 + i * 8) + '" y="' + (62 - h / 2) + '" width="4" height="' + h + '" rx="2"/>'; });
    return S(bars + '<path class="l" d="M20 112h160"/><path class="l" d="M20 108v8M70 108v8M130 108v8M180 108v8"/>' +
      '<text class="tx" x="20" y="130">0</text><text class="tx" x="156" y="130">1 s</text><rect class="f" x="70" y="104" width="60" height="16" rx="2" opacity=".5"/>');
  }
  if (t === 'infra') {
    let g = '';
    const fills = [0.9, 0.7, 0.85, 0.4, 0.95, 0.6];
    for (let i = 0; i < 6; i++) {
      const x = 16 + (i % 3) * 40, y = 26 + Math.floor(i / 3) * 50;
      g += '<rect class="p" x="' + x + '" y="' + y + '" width="32" height="40" rx="3"/>' +
        '<rect class="bar-a" x="' + (x + 5) + '" y="' + (y + 35 - 28 * fills[i]) + '" width="22" height="' + (28 * fills[i]) + '" rx="1.5"/>';
    }
    return S(g + '<path class="l" d="M150 92a26 26 0 0 1 36-24"/><path class="a" d="M142 98a32 32 0 0 1 52-38" stroke-width="3"/>' +
      '<path class="a" d="m168 92 12-16"/><circle class="dot-a" cx="168" cy="92" r="3"/><text class="tx" x="146" y="118">tok/s</text>');
  }
  return S(
    '<circle class="p" cx="26" cy="70" r="12"/><circle class="p" cx="76" cy="36" r="12"/><circle class="p" cx="76" cy="104" r="12"/>' +
    '<circle class="f" cx="128" cy="70" r="14"/><circle class="p" cx="178" cy="70" r="12"/>' +
    '<path class="l" d="M37 64l28-22M37 76l28 22M88 40l28 24M88 100l28-24"/><path class="a flow-edge" d="M142 70h24"/>' +
    '<path class="a" d="M122 70l4 4 8-8"/><path class="warn-s" d="M70 30h12M76 24v12"/>' +
    '<text class="tx" x="104" y="104">approve</text>');
}

export function archFigure(nodes: string[], caption: string): string {
  const n = nodes.length, w = 92, gap = (740 - n * w) / Math.max(1, n - 1);
  let s = '<svg class="draw-ready" viewBox="0 0 760 110" role="img" aria-label="Architecture: ' + esc(nodes.join(' to ')) + '">';
  nodes.forEach((label, i) => {
    const x = 10 + i * (w + gap);
    if (i < n - 1) s += '<path class="flow-edge sys-edge-a" d="M' + (x + w) + ' 55H' + (x + w + gap) + '"/>';
    s += '<g class="sys-node' + (i === n - 1 ? ' hot' : '') + '"><rect x="' + x + '" y="30" width="' + w + '" height="50" rx="6"/>' +
      '<text x="' + (x + w / 2) + '" y="59" text-anchor="middle">' + esc(label) + '</text></g>' +
      '<text class="tx" x="' + (x + 2) + '" y="22">' + pad2(i + 1) + '</text>';
  });
  s += '</svg>';
  const list = '<ol class="arch-v">' + nodes.map((l, i) => '<li><span>' + pad2(i + 1) + '</span>' + esc(l) + '</li>').join('') + '</ol>';
  return s + list + '<figcaption>' + esc(caption) + '</figcaption>';
}

export function systemSVG(): string {
  const node = (id: string, x: number, y: number, a: string, b: string) => '<g class="sys-node" id="n-' + id + '" data-x="' + x + '" data-y="' + y + '"><rect x="' + x + '" y="' + y + '" width="100" height="46" rx="6"/>' +
    '<text x="' + (x + 12) + '" y="' + (y + 20) + '">' + a + '</text><text class="sub" x="' + (x + 12) + '" y="' + (y + 35) + '">' + b + '</text></g>';
  return '<svg viewBox="0 0 770 254" role="img" aria-label="Simulated request flowing through a RAG system: request, gateway, retriever, vector database or cache, LLM, evaluator, response">' +
    '<path class="sys-edge" d="M110 127H140M240 127H270M370 127H400M500 127H530M630 127H660M320 150V196M320 104V58"/>' +
    '<path class="sys-edge retry" d="M580 104C560 68 470 68 450 104"/>' +
    '<path id="route-a" d="M60 127H190H320V219V127H450H580H710" fill="none" stroke="none"/>' +
    '<path id="route-b" d="M60 127H190H320V35V127H450H580H710" fill="none" stroke="none"/>' +
    '<path id="route-c" d="M60 127H190H320V219V127H450H580C560 68 470 68 450 104L450 127H580H710" fill="none" stroke="none"/>' +
    '<g id="packets"></g>' +
    node('req', 10, 104, 'request', 'user query') +
    node('gw', 140, 104, 'gateway', 'auth · limits') +
    node('cache', 270, 12, 'cache', 'semantic') +
    node('ret', 270, 104, 'retriever', 'hybrid search') +
    node('vdb', 270, 196, 'vector db', 'pgvector') +
    node('llm', 400, 104, 'llm', 'vLLM · open') +
    node('ev', 530, 104, 'evaluator', 'guardrails') +
    node('out', 660, 104, 'response', 'cited answer') +
    '<text class="tx" x="482" y="62">retry</text>' +
    '</svg>';
}
