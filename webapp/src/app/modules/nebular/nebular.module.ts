import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NbToastrModule,

  NbLayoutModule,
  NbListModule,
  NbCardModule,
  NbBadgeModule,
  NbTagModule,
  NbSelectModule,
  NbInputModule,
  NbButtonModule,
  NbAccordionModule,
  NbToggleModule,
  NbTabsetModule,
  NbIconModule,
  NbSearchModule,
  NbTreeGridModule,
  NbUserModule,
  NbPopoverModule,
  NbActionsModule,
  NbTooltipModule,
  NbToastrService,
  NbContextMenuModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbEvaIconsModule,
  ],
  providers: [
    NbToastrService
  ],
  exports: [
    NbLayoutModule,
    NbEvaIconsModule,
    NbListModule,
    NbCardModule,
    NbBadgeModule,
    NbTagModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbAccordionModule,
    NbToggleModule,
    NbToastrModule,
    NbTabsetModule,
    NbIconModule,
    NbSearchModule,
    NbTreeGridModule,
    NbUserModule,
    NbPopoverModule,
    NbActionsModule,
    NbTooltipModule,
    NbContextMenuModule
  ]
})
export class SharedNebularModule { }
