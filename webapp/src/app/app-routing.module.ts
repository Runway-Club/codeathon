import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'problem/:id',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/problem/problem.module').then((m) => m.ProblemModule),
  },
  {
    path: 'manage',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/manage/manage.module').then((m) => m.ManageModule),
  },
  {
    path: 'newproblem',
    loadChildren: () =>
      import('./pages/newproblem/newproblem.module').then(
        (m) => m.NewproblemModule
      ),
  },
  {
    path: 'achievement',
    loadChildren: () =>
      import('./pages/achievement/achievement.module').then(
        (m) => m.AchievementModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
