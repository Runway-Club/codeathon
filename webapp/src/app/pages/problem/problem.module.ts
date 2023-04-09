import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { SharedNebularModule } from 'src/app/modules/nebular/nebular.module';
import { ProblemRoutingModule } from './problem-routing.module';

import { ProblemComponent } from './problem.component';
import { SharedModule } from 'src/app/modules/shared.module';
import { EditorComponent } from './components/editor/editor.component';
import { InfoComponent } from './components/info/info.component';

@NgModule({
  declarations: [
    ProblemComponent,
    EditorComponent,
    InfoComponent,
  ],
  imports: [
    CommonModule,
    ProblemRoutingModule,
    FormsModule,
    MonacoEditorModule,

    SharedModule,
    SharedNebularModule,
  ],
})
export class ProblemModule { }
