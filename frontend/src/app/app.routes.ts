import { Routes } from '@angular/router';

/* Every page is lazy-loaded, so the first visit downloads only what it needs. */
export const routes: Routes = [
  { path: '', title: 'Wesley Nyamosi — AI Engineering & Consulting', loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage) },
  { path: 'about', title: 'About — Wesley Nyamosi', loadComponent: () => import('./pages/about.page').then((m) => m.AboutPage) },
  { path: 'work', title: 'Work — Wesley Nyamosi', loadComponent: () => import('./pages/work.page').then((m) => m.WorkPage) },
  { path: 'work/:slug', title: 'Case Study — Wesley Nyamosi', loadComponent: () => import('./pages/work-detail.page').then((m) => m.WorkDetailPage) },
  { path: 'consulting', title: 'Consulting — Wesley Nyamosi', loadComponent: () => import('./pages/consulting.page').then((m) => m.ConsultingPage) },
  { path: 'lab', title: 'AI Lab — Wesley Nyamosi', loadComponent: () => import('./pages/lab.page').then((m) => m.LabPage) },
  { path: 'lab/:slug', title: 'AI Lab — Wesley Nyamosi', loadComponent: () => import('./pages/lab-detail.page').then((m) => m.LabDetailPage) },
  { path: 'writing', title: 'Writing — Wesley Nyamosi', loadComponent: () => import('./pages/writing.page').then((m) => m.WritingPage) },
  { path: 'writing/:slug', title: 'Writing — Wesley Nyamosi', loadComponent: () => import('./pages/post.page').then((m) => m.PostPage) },
  { path: 'ask', title: 'Ask Wesley\'s AI', loadComponent: () => import('./pages/ask.page').then((m) => m.AskPage) },
  { path: 'contact', title: 'Contact — Wesley Nyamosi', loadComponent: () => import('./pages/contact.page').then((m) => m.ContactPage) },
  { path: 'privacy', title: 'Privacy — Wesley Nyamosi', loadComponent: () => import('./pages/privacy.page').then((m) => m.PrivacyPage) },
  { path: 'admin', title: 'Admin — Wesley Nyamosi', loadComponent: () => import('./pages/admin/admin.page').then((m) => m.AdminPage) },
  { path: '**', title: 'Not found — Wesley Nyamosi', loadComponent: () => import('./pages/not-found.page').then((m) => m.NotFoundPage) }
];
