import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainComponent } from './components/main/main.component';
import { NbAccordionModule, NbActionsModule, NbBadgeModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbLayoutModule, NbPopoverModule, NbSearchModule, NbSelectModule, NbTabsetModule, NbTagModule, NbToastrModule, NbToastrService, NbToggleModule, NbTreeGridModule, NbUserModule } from '@nebular/theme';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { MarkdownModule, MarkdownService } from 'ngx-markdown'
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { FormsModule } from '@angular/forms';
import { ProblemComponent } from './components/problem/problem.component';
import { HistoryComponent } from './components/problem/components/history/history.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { SubmissionComponent } from './components/problem/components/submission/submission.component';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    MainComponent,
    NewProblemComponent,
    ProblemComponent,
    HistoryComponent,
    SubmissionComponent
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
    MarkdownModule.forChild(),
    LMarkdownEditorModule,
    NbButtonModule,
    NbAccordionModule,
    NbToggleModule,
    FormsModule,
    NbToastrModule,
    NbTabsetModule,
    NbEvaIconsModule,
    NbIconModule,
    NbSearchModule,
    NbTreeGridModule,
    NbUserModule,
    NbPopoverModule,
    MonacoEditorModule,
    NbActionsModule,
  ],
  providers: [
    NbToastrService
  ]
})
export class HomeModule { }
