import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, of, timeout } from 'rxjs';

import { environment } from '../../environments/environment';
import { LAB, POSTS, PROJECTS } from './data/content.data';
import { LabEntry, Post, Project } from './models';

/**
 * Projects, lab entries and articles.
 * Pages render instantly from the bundled copy, then switch to the live data
 * from the Spring Boot API (which Wesley can edit) as soon as it answers.
 * If the API is asleep or unreachable the site keeps working with the bundled copy.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  readonly projects = signal<Project[]>(PROJECTS);
  readonly lab = signal<LabEntry[]>(LAB);
  readonly posts = signal<Post[]>(POSTS);
  readonly live = signal(false);

  private loaded = false;

  load(): void {
    if (this.loaded) return;
    this.loaded = true;
    this.fetch<Project[]>('/api/projects', (list) => this.projects.set(list));
    this.fetch<LabEntry[]>('/api/lab', (list) => this.lab.set(list));
    this.fetch<Post[]>('/api/posts', (list) => this.posts.set(list));
  }

  project(slug: string): Project | undefined {
    return this.projects().find((p) => p.slug === slug);
  }

  labEntry(slug: string): LabEntry | undefined {
    return this.lab().find((l) => l.slug === slug);
  }

  post(slug: string): Post | undefined {
    return this.posts().find((p) => p.slug === slug);
  }

  private fetch<T extends unknown[]>(path: string, apply: (v: T) => void): void {
    this.http.get<T>(this.base + path)
      .pipe(timeout(15000), catchError(() => of(null)))
      .subscribe((list) => {
        if (Array.isArray(list) && list.length) {
          apply(list);
          this.live.set(true);
        }
      });
  }
}
