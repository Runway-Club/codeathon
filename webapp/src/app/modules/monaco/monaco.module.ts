import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonacoEditorModule,
  ],
  providers: [
    {
      provide: MONACO_PATH,
      useValue: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.32.0/min/vs',
    },
  ],
  exports: [
    MonacoEditorModule,
  ],
})
export class SharedMonacoModule { }
