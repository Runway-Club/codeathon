import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    }),
    LMarkdownEditorModule,
  ],
  providers: [
    MarkdownService,

  ],
  exports: [
    MarkdownModule,
    LMarkdownEditorModule,
  ],
})
export class SharedMarkdownModule { }
