import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewproblemRoutingModule } from './newproblem-routing.module';
import { NewproblemComponent } from './newproblem.component';
import { ProblemRoutingModule } from '../problem/problem-routing.module';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { SharedModule } from 'src/app/modules/shared.module';
import { SharedNebularModule } from 'src/app/modules/nebular/nebular.module';
import { CreateComponent } from './create/create.component';
import { PreviewComponent } from './preview/preview.component';
import { SharedMarkdownModule } from 'src/app/modules/markdown/markdown.module';

@NgModule({
  declarations: [NewproblemComponent, CreateComponent, PreviewComponent],
  imports: [
    CommonModule,
    NewproblemRoutingModule,
    ProblemRoutingModule,
    FormsModule,
    MonacoEditorModule,

    SharedModule,
    SharedNebularModule,
    SharedMarkdownModule,
  ],
})
export class NewproblemModule {}
