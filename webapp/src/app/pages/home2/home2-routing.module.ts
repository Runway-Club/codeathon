import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home2Component } from './home2.component';
import { ProblemsetComponent } from './components/problemset/problemset.component';

const routes: Routes = [
  {
    path: '', component: Home2Component, children:
      [
        { path: '', component: ProblemsetComponent },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Home2RoutingModule { }
