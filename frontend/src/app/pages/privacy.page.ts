import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SiteService } from '../core/site.service';
import { SeoService } from '../core/seo.service';
import { PageHeadComponent } from '../shared/page-head.component';

@Component({
  selector: 'app-privacy-page',
  imports: [PageHeadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  template: `
    <app-page-head [crumbs]="[{ label: 'home', link: '/' }, { label: 'privacy' }]" title="Privacy policy"
      lede="Plain-language summary of what this website collects and why. Last updated Oct 22, 2026." />
    <div class="wrap" style="padding:48px 0 80px">
      <article class="prose">
        <section><h2>What this site collects</h2><p>Only what is needed to reply to you and to understand how the site is used. There are no advertising trackers and no data is ever sold.</p></section>
        <section><h2>Email</h2><p>If you email Wesley, your address and message are used only to reply to you. You can ask for them to be deleted at any time.</p></section>
        <section id="assistant"><h2>Ask Wesley's AI</h2><p>Questions you send to the assistant are processed to generate an answer from this website's public content. Questions are logged (with your IP address stored only as a one-way hash) to monitor quality and prevent abuse. Please don't enter confidential or personal information. Usage is rate limited.</p></section>
        <section id="analytics"><h2>Visit statistics</h2>
          <p>To understand how the site is used, it records the pages you view and how long you stay on them, the site that referred you, and actions such as downloading the CV or opening a link. With each visit it stores your IP address, the approximate location derived from it (country, region, city), and your browser, operating system, device type, screen size, language and time zone.</p>
          <p>A random visitor ID is kept in your browser's local storage so repeat visits can be recognised. No cookies, no advertising networks and no cross-site tracking are used, and the data is only visible to the site owner.</p>
        </section>
        <section><h2>Retention</h2><p>Contact enquiries are kept for up to 24 months. Visit statistics and assistant logs are kept for up to 12 months and then deleted automatically.</p></section>
        <section><h2>Your rights</h2><p>You can ask to see, correct or delete your data. Email <a [href]="'mailto:' + email">{{ email }}</a>.</p></section>
      </article>
    </div>
  `
})
export class PrivacyPage {
  private site = inject(SiteService);
  get email(): string { return this.site.email(); }
  constructor() {
    inject(SeoService).set('Privacy', 'What this website collects, why, and for how long.', '/privacy');
  }
}
