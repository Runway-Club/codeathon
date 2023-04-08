import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { MarkdownModule, MarkdownService } from 'ngx-markdown'
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { FormsModule } from '@angular/forms';
import { SharedNebularModule } from 'src/app/modules/nebular/nebular.module';
import { SharedModule } from 'src/app/modules/shared.module';

//components
import { HomeComponent } from './home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainComponent } from './components/main/main.component';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ProblemComponent } from './components/problem/problem.component';
import { HistoryComponent } from './components/problem/components/history/history.component';
import { SubmissionComponent } from './components/problem/components/submission/submission.component';
import { ManageProblemComponent } from './components/manage-problem/manage-problem.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    MainComponent,
    NewProblemComponent,
    ProblemComponent,
    HistoryComponent,
    SubmissionComponent,
    ManageProblemComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MarkdownModule.forChild(),
    LMarkdownEditorModule,
    FormsModule,
    MonacoEditorModule,
    SharedNebularModule,
    SharedModule
  ],
})
export class HomeModule {

}
