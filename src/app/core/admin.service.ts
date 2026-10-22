import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { AdminStats, AskLog, Lead, LeadStatus, LoginResponse } from './models';

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

  private read(): string | null {
    try { return sessionStorage.getItem(KEY); } catch { return null; }
  }
}
