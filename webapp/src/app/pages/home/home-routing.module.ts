import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProblemsetComponent } from './components/problemset/problemset.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, children:
      [
        { path: '', component: ProblemsetComponent },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
