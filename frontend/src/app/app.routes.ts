import { Routes } from '@angular/router';

/* Every page is lazy-loaded, so the first visit downloads only what it needs. */
export const routes: Routes = [
  { path: '', title: 'Wesley Nyamosi — AI Engineering', loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage) },
  { path: 'work', title: 'Work — Wesley Nyamosi', loadComponent: () => import('./pages/work.page').then((m) => m.WorkPage) },
  { path: 'work/:slug', title: 'Case Study — Wesley Nyamosi', loadComponent: () => import('./pages/work-detail.page').then((m) => m.WorkDetailPage) },
  { path: 'blogs', title: 'Blogs — Wesley Nyamosi', loadComponent: () => import('./pages/writing.page').then((m) => m.WritingPage) },
  { path: 'blogs/:slug', title: 'Blogs — Wesley Nyamosi', loadComponent: () => import('./pages/post.page').then((m) => m.PostPage) },
  /* old URLs: the Consulting, AI Lab, About and Contact pages were removed and Writing became Blogs */
  { path: 'about', redirectTo: '', pathMatch: 'full' },
  { path: 'contact', redirectTo: '/#contact', pathMatch: 'full' },
  { path: 'consulting', redirectTo: '/#contact', pathMatch: 'full' },
  { path: 'lab', redirectTo: 'work', pathMatch: 'full' },
  { path: 'lab/:slug', redirectTo: 'work', pathMatch: 'full' },
  { path: 'writing', redirectTo: 'blogs', pathMatch: 'full' },
  { path: 'writing/:slug', redirectTo: 'blogs/:slug', pathMatch: 'full' },
  { path: 'ask', title: 'Ask Wesley\'s AI', loadComponent: () => import('./pages/ask.page').then((m) => m.AskPage) },
  { path: 'privacy', title: 'Privacy — Wesley Nyamosi', loadComponent: () => import('./pages/privacy.page').then((m) => m.PrivacyPage) },
  { path: 'admin', title: 'Admin — Wesley Nyamosi', loadComponent: () => import('./pages/admin/admin.page').then((m) => m.AdminPage) },
  { path: '**', title: 'Not found — Wesley Nyamosi', loadComponent: () => import('./pages/not-found.page').then((m) => m.NotFoundPage) }
];
