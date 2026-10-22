import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SITE } from '../core/data/site.data';
import { SeoService } from '../core/seo.service';
import { PageHeadComponent } from '../shared/page-head.component';

@Component({
  selector: 'app-privacy-page',
  imports: [PageHeadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <app-page-head [crumbs]="[{ label: 'home', link: '/' }, { label: 'privacy' }]" title="Privacy policy"
      lede="Plain-language summary of what this website collects and why. Last updated Oct 1, 2026." />
    <div class="wrap" style="padding:48px 0 80px">
      <article class="prose">
        <section><h2>What this site collects</h2><p>Only what is needed to reply to you and to understand, in aggregate, how the site is used. No advertising trackers, and no data is sold.</p></section>
        <section><h2>Contact form</h2><p>Your name, email, company, role, and the details you write are stored securely and used only to respond to your enquiry. You can ask for them to be deleted at any time.</p></section>
        <section id="assistant"><h2>Ask Wesley's AI</h2><p>Questions you send to the assistant are processed to generate an answer from this website's public content. Questions are logged without personal identifiers (your IP address is stored only as a one-way hash) to monitor quality and prevent abuse. Please don't enter confidential or personal information. Usage is rate limited.</p></section>
        <section><h2>Analytics</h2><p>The site uses privacy-friendly, cookie-free analytics that count page views and referrers without identifying you.</p></section>
        <section><h2>Retention</h2><p>Contact enquiries are kept for up to 24 months. Assistant logs are kept for up to 90 days.</p></section>
        <section><h2>Your rights</h2><p>You can ask to see, correct or delete your data. Email <a [href]="'mailto:' + email">{{ email }}</a>.</p></section>
      </article>
    </div>
  `
})
export class PrivacyPage {
  readonly email = SITE.email;
  constructor() {
    inject(SeoService).set('Privacy', 'What this website collects, why, and for how long.', '/privacy');
  }
}
