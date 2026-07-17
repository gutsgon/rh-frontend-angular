import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'principal' },
  {
    path: 'principal',
    loadComponent: () => import('./features/principal/principal').then((m) => m.Principal),
  },
  {
    path: 'funcionarios',
    loadComponent: () =>
      import('./features/funcionarios/funcionario-list/funcionario-list').then((m) => m.FuncionarioList),
  },
  {
    path: 'funcionarios/novo',
    loadComponent: () =>
      import('./features/funcionarios/funcionario-form/funcionario-form').then((m) => m.FuncionarioForm),
  },
  {
    path: 'funcionarios/:id',
    loadComponent: () =>
      import('./features/funcionarios/funcionario-detalhes/funcionario-detalhes').then(
        (m) => m.FuncionarioDetalhes,
      ),
  },
  {
    path: 'funcionarios/:id/editar',
    loadComponent: () =>
      import('./features/funcionarios/funcionario-form/funcionario-form').then((m) => m.FuncionarioForm),
  },
  {
    path: 'ferias',
    loadComponent: () => import('./features/ferias/ferias-list/ferias-list').then((m) => m.FeriasList),
  },
  {
    path: 'relatorio',
    loadComponent: () => import('./features/relatorio/relatorio').then((m) => m.Relatorio),
  },
  { path: '**', redirectTo: 'principal' },
];
