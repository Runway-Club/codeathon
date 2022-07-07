import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainComponent } from './components/main/main.component';
import { NbBadgeModule, NbCardModule, NbInputModule, NbLayoutModule, NbSelectModule, NbTagModule } from '@nebular/theme';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { MarkdownModule, MarkdownService } from 'ngx-markdown'

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    MainComponent,
    NewProblemComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NbLayoutModule,
    NbCardModule,
    NbBadgeModule,
    NbTagModule,
    NbSelectModule,
    NbInputModule,
    MarkdownModule.forChild()
  ],
  providers: [

  ]
})
export class HomeModule { }
