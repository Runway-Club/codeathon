import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage.component';
import { YourmanageComponent } from './yourmanage/yourmanage.component';

const routes: Routes = [
  { 
    path: '', component: ManageComponent, children: 
    [
      { path: '', component: YourmanageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
