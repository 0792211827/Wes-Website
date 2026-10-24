import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SITE } from './data/site.data';

/** Page title, description and canonical URL for search engines and link previews. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  set(title: string, description?: string, path?: string): void {
    const full = title.includes('Wesley') ? title : title + ' — Wesley Nyamosi';
    this.title.setTitle(full);
    this.meta.updateTag({ property: 'og:title', content: full });
    this.meta.updateTag({ name: 'twitter:title', content: full });
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:description', content: description });
    }
    const url = SITE.url + (path ?? this.doc.location.pathname);
    this.meta.updateTag({ property: 'og:url', content: url });
    const link = this.doc.querySelector('link[rel="canonical"]');
    if (link) link.setAttribute('href', url);
  }
}
