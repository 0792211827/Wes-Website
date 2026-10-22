import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AdminService } from '../../core/admin.service';
import { problemMessage } from '../../core/api.service';
import { FileInfo } from '../../core/models';
import { SiteService } from '../../core/site.service';
import { ToastService } from '../../core/toast.service';

/** Admin: upload the profile photo (shown as the ASCII → photo portrait) and the CV (all "Download CV" buttons). */
@Component({
  selector: 'app-admin-files',
  imports: [DatePipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'host-block' },
  template: `
    <div class="ad-files">
      <section class="card ad-group">
        <h3>Profile photo</h3>
        <p class="ad-sub">Shown on the home page: it first appears as animated ASCII art, then the real photo sweeps in. JPG, PNG or WebP up to 5 MB; a portrait crop (about 4:5) works best.</p>
        <div class="ad-photo">
          @if (site.photoFile(); as f) {
            <img [src]="site.photoUrl()" alt="Current profile photo">
          } @else {
            <div class="ad-photo-empty">No photo uploaded yet. The site shows the ASCII silhouette.</div>
          }
        </div>
        @if (site.photoFile(); as f) { <p class="ad-meta">{{ meta(f) }} · updated {{ f.updatedAt | date: 'MMM d, y HH:mm' }}</p> }
        <div class="hero-ctas">
          <label class="btn btn-sm btn-primary ad-upload">
            {{ busy() === 'photo' ? 'Uploading…' : (site.photoFile() ? 'Replace photo' : 'Upload photo') }}
            <input type="file" accept="image/jpeg,image/png,image/webp" (change)="upload('photo', $event)" [disabled]="busy() !== ''">
          </label>
          @if (site.photoFile()) {
            <button class="btn btn-sm" type="button" (click)="remove('photo')">Remove</button>
          }
        </div>
      </section>

      <section class="card ad-group">
        <h3>CV</h3>
        <p class="ad-sub">Every "Download CV" button on the site serves this file (it downloads as Wesley-Nyamosi-CV.pdf). PDF up to 10 MB. While no CV is uploaded, the buttons are hidden.</p>
        @if (site.cvFile(); as f) {
          <div class="ad-cv">
            <span class="ad-cv-icon" aria-hidden="true">PDF</span>
            <div>
              <b>{{ f.filename }}</b>
              <p class="ad-meta">{{ (f.size / 1024) | number: '1.0-0' }} KB · updated {{ f.updatedAt | date: 'MMM d, y HH:mm' }}</p>
            </div>
            <a class="btn btn-sm" [href]="site.cvUrl()" target="_blank" rel="noopener">Open ↗</a>
          </div>
        } @else {
          <div class="ad-photo-empty" style="min-height:90px">No CV uploaded yet.</div>
        }
        <div class="hero-ctas">
          <label class="btn btn-sm btn-primary ad-upload">
            {{ busy() === 'cv' ? 'Uploading…' : (site.cvFile() ? 'Replace CV' : 'Upload CV') }}
            <input type="file" accept="application/pdf" (change)="upload('cv', $event)" [disabled]="busy() !== ''">
          </label>
          @if (site.cvFile()) {
            <button class="btn btn-sm" type="button" (click)="remove('cv')">Remove</button>
          }
        </div>
      </section>
    </div>
  `
})
export class AdminFilesComponent {
  private admin = inject(AdminService);
  readonly site = inject(SiteService);
  private toast = inject(ToastService);
  readonly busy = signal<'' | 'photo' | 'cv'>('');

  constructor() {
    this.refresh();
  }

  meta(f: FileInfo): string {
    return f.filename + ' · ' + Math.round(f.size / 1024) + ' KB';
  }

  upload(key: 'photo' | 'cv', ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    input.value = '';
    if (!file) return;
    const limit = key === 'photo' ? 5 : 10;
    if (file.size > limit * 1024 * 1024) { this.toast.show('That file is larger than ' + limit + ' MB.'); return; }
    this.busy.set(key);
    this.admin.upload(key, file).subscribe({
      next: () => { this.busy.set(''); this.toast.show(key === 'photo' ? 'Photo uploaded.' : 'CV uploaded.'); this.refresh(); },
      error: (err: unknown) => { this.busy.set(''); this.toast.show(problemMessage(err, 'Upload failed.')); }
    });
  }

  remove(key: 'photo' | 'cv'): void {
    if (!confirm(key === 'photo' ? 'Remove the profile photo?' : 'Remove the CV? The Download CV buttons will be hidden.')) return;
    this.admin.deleteFile(key).subscribe({
      next: () => { this.toast.show('Removed.'); this.refresh(); },
      error: (err: unknown) => this.toast.show(problemMessage(err))
    });
  }

  private refresh(): void {
    this.admin.site().subscribe({ next: (res) => this.site.apply(res), error: () => undefined });
  }
}
