import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';
import { Login } from './login';

export default [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    loadComponent: () => import('./register').then((m) => m.Register),
  },
  {
    path: 'access',
    component: Access,
  },
  {
    path: 'error',
    component: Error,
  },
] as Routes;