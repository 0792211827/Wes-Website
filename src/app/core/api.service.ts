import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, throwError, timeout } from 'rxjs';

import { environment } from '../../environments/environment';
import { answerLocally } from './local-ask';
import { AskResponse, ContactRequest, ContactResponse, Contributions, GithubRepo } from './models';

const ASK_QUOTA = 15;

/** Calls to the Spring Boot API: contact form, Ask Wesley's AI and GitHub data. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  /** Questions left this hour (the server is the source of truth when online). */
  readonly askRemaining = signal<number>(this.readLocalRemaining());
  readonly askQuota = ASK_QUOTA;

  sendContact(body: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.base + '/api/contact', body).pipe(timeout(30000));
  }

  /**
   * Ask the assistant. Rate-limit and validation errors are passed on;
   * if the API is unreachable, the offline knowledge base answers instead.
   */
  ask(question: string, sessionId: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(this.base + '/api/ask', { question, sessionId }).pipe(
      timeout(30000),
      map((res) => {
        if (typeof res.remaining === 'number') this.setRemaining(res.remaining);
        return res;
      }),
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse && (err.status === 429 || err.status === 400)) {
          if (err.status === 429) this.setRemaining(0);
          return throwError(() => err);
        }
        const left = Math.max(0, this.askRemaining() - 1);
        this.setRemaining(left);
        return of(answerLocally(question, left));
      })
    );
  }

  suggestions(): Observable<string[] | null> {
    return this.http.get<string[]>(this.base + '/api/ask/suggestions').pipe(timeout(8000), catchError(() => of(null)));
  }

  githubRepos(): Observable<GithubRepo[] | null> {
    return this.http.get<GithubRepo[]>(this.base + '/api/github/repos').pipe(timeout(12000), catchError(() => of(null)));
  }

  githubContributions(): Observable<Contributions | null> {
    return this.http.get<Contributions>(this.base + '/api/github/contributions').pipe(timeout(12000), catchError(() => of(null)));
  }

  private setRemaining(n: number): void {
    this.askRemaining.set(n);
    try { sessionStorage.setItem('wn-ask-left', String(n)); } catch { /* ignore */ }
  }

  private readLocalRemaining(): number {
    try {
      const v = sessionStorage.getItem('wn-ask-left');
      return v === null ? ASK_QUOTA : Math.max(0, Math.min(ASK_QUOTA, Number(v) || 0));
    } catch {
      return ASK_QUOTA;
    }
  }
}

/** Reads the friendliest message out of a Spring ProblemDetail error. */
export function problemMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (err instanceof HttpErrorResponse) {
    const body = err.error as { detail?: string; title?: string } | null;
    if (err.status === 0) return 'Can\'t reach the server right now. Please try again in a minute.';
    if (err.status === 429) return body?.detail || 'Too many requests. Please wait a little and try again.';
    if (body && typeof body === 'object' && (body.detail || body.title)) return String(body.detail || body.title);
  }
  return fallback;
}
