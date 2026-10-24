import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  AdminStats, AnalyticsSummary, AskLog, FileInfo, KnowledgeEntry, LabEntry, Lead, LeadStatus, LoginResponse, Post, Project,
  SessionDetail, SiteResponse, VisitSession
} from './models';

const KEY = 'wn-admin-token';

/** Admin dashboard: login token (kept for this browser tab only) and admin API calls. */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;
  readonly token = signal<string | null>(this.read());

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.base + '/api/auth/login', { username, password }).pipe(
      tap((res) => {
        this.token.set(res.token);
        try { sessionStorage.setItem(KEY, res.token); } catch { /* ignore */ }
      })
    );
  }

  logout(): void {
    this.token.set(null);
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  }

  stats(): Observable<AdminStats> { return this.http.get<AdminStats>(this.base + '/api/admin/stats'); }
  leads(): Observable<Lead[]> { return this.http.get<Lead[]>(this.base + '/api/admin/leads'); }
  updateLead(id: number, change: { status?: LeadStatus; notes?: string }): Observable<Lead> {
    return this.http.patch<Lead>(this.base + '/api/admin/leads/' + id, change);
  }
  deleteLead(id: number): Observable<void> { return this.http.delete<void>(this.base + '/api/admin/leads/' + id); }
  askLogs(): Observable<AskLog[]> { return this.http.get<AskLog[]>(this.base + '/api/admin/ask-logs'); }

  /* ---------- website settings & files ---------- */
  site(): Observable<SiteResponse> { return this.http.get<SiteResponse>(this.base + '/api/admin/site'); }
  updateSite(changes: Record<string, string>): Observable<SiteResponse> {
    return this.http.put<SiteResponse>(this.base + '/api/admin/site', changes);
  }
  resetSite(): Observable<SiteResponse> { return this.http.delete<SiteResponse>(this.base + '/api/admin/site'); }
  /** Uploads go straight to the API (Vercel's proxy limits request size). */
  upload(key: 'photo' | 'cv', file: File): Observable<FileInfo> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<FileInfo>((environment.uploadApiUrl || this.base) + '/api/admin/files/' + key, form);
  }
  deleteFile(key: 'photo' | 'cv'): Observable<void> { return this.http.delete<void>(this.base + '/api/admin/files/' + key); }

  /* ---------- visitor workspace ---------- */
  analytics(days: number): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(this.base + '/api/admin/analytics/summary?days=' + days);
  }
  sessions(days: number, q: string): Observable<VisitSession[]> {
    return this.http.get<VisitSession[]>(this.base + '/api/admin/analytics/sessions?days=' + days + '&limit=300&q=' + encodeURIComponent(q));
  }
  session(id: string): Observable<SessionDetail> {
    return this.http.get<SessionDetail>(this.base + '/api/admin/analytics/sessions/' + encodeURIComponent(id));
  }

  /* ---------- content ---------- */
  saveProject(p: Project): Observable<Project> { return this.http.put<Project>(this.base + '/api/admin/projects', p); }
  deleteProject(slug: string): Observable<void> { return this.http.delete<void>(this.base + '/api/admin/projects/' + encodeURIComponent(slug)); }
  saveLab(l: LabEntry): Observable<LabEntry> { return this.http.put<LabEntry>(this.base + '/api/admin/lab', l); }
  deleteLab(slug: string): Observable<void> { return this.http.delete<void>(this.base + '/api/admin/lab/' + encodeURIComponent(slug)); }
  savePost(p: Post): Observable<Post> { return this.http.put<Post>(this.base + '/api/admin/posts', p); }
  deletePost(slug: string): Observable<void> { return this.http.delete<void>(this.base + '/api/admin/posts/' + encodeURIComponent(slug)); }
  knowledge(): Observable<KnowledgeEntry[]> { return this.http.get<KnowledgeEntry[]>(this.base + '/api/admin/knowledge'); }
  saveKnowledge(k: KnowledgeEntry): Observable<KnowledgeEntry> { return this.http.put<KnowledgeEntry>(this.base + '/api/admin/knowledge', k); }
  deleteKnowledge(key: string): Observable<void> { return this.http.delete<void>(this.base + '/api/admin/knowledge/' + encodeURIComponent(key)); }

  private read(): string | null {
    try { return sessionStorage.getItem(KEY); } catch { return null; }
  }
}
