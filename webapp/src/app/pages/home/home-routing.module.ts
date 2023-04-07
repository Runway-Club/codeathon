import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { ProblemComponent } from './components/problem/problem.component';
import { HomeComponent } from './home.component';
import { ManageProblemComponent } from './components/manage-problem/manage-problem.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {
        path: '', component: MainComponent
      },
      {
        path: 'problem-editor', component: NewProblemComponent
      },
      {
        path: 'manage', component: ManageProblemComponent
      },
      {
        path: 'problem/:id', component: ProblemComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
