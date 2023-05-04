import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import { ManageComponent } from './manage.component';

import { SharedNebularModule} from 'src/app/modules/nebular/nebular.module';
import { YourmanageComponent } from './yourmanage/yourmanage.component';
import { SharedModule } from 'src/app/modules/shared.module';


@NgModule({
  declarations: [
    ManageComponent,
    YourmanageComponent
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    SharedNebularModule,
    SharedModule
  ]
})
export class ManageModule { }
