import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewproblemComponent } from './newproblem.component';

const routes: Routes = [{ path: '', component: NewproblemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewproblemRoutingModule { }
