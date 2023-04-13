import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  MonacoEditorConstructionOptions,
  MonacoEditorLoaderService
} from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Problem } from 'src/models/problem.model';

interface CodeTab {
  id: number;
  languageId: number;
  code: string;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(
    private monacoService: MonacoEditorLoaderService,
    private authService: AuthService,
  ) { }

  @Output() submitCode: EventEmitter<any> = new EventEmitter();
  @Input() problem?: Problem;

  user = this.authService.user;

  codeTabs: CodeTab[] = []
  currentCodeTab?: CodeTab;

  editorOptions: MonacoEditorConstructionOptions = {
    theme: 'codeathon-theme',
    language: 'python',
    autoIndent: 'full',
    minimap: {
      enabled: true,
      renderCharacters: false
    },
    fontSize: 16,
  };

  ngOnInit(): void {
    this.monacoService.isMonacoLoaded$
      .pipe(filter(isLoaded => isLoaded), take(1))
      .subscribe(this.registerMonacoCustomTheme);

    this.initializer();
  }

  initializer() {
    this.createTab();
  }

  registerMonacoCustomTheme = () => {
    monaco.editor.defineTheme('codeathon-theme', {
      base: 'vs-dark', // can also be vs or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [],
      colors: {},
    });
  }

  createTab() {
    let newTab: CodeTab = {
      id: Date.now(),
      languageId: 71,
      code: 'def main():\n    print("Hello World")'
    }

    this.codeTabs.push(newTab);
    this.currentCodeTab = newTab;
  }

  handleChangeTab(id: number) {
    let tempTab = this.codeTabs.find(element => element.id === id);

    if (tempTab) {
      this.currentCodeTab = tempTab;
    }
  }

  handleDeleteTab(id: number) {
    let tempTab = this.codeTabs.find(element => element.id === id);
    if (!tempTab) return;

    let index = this.codeTabs.indexOf(tempTab);
    this.codeTabs.splice(index, 1);

    if (index > 0) {
      this.currentCodeTab = this.codeTabs[index - 1];
    }

    if (index === 0) {
      this.currentCodeTab = this.codeTabs[0];
    }
  }

  submit() {
    this.submitCode.emit(this.createSubmission());
  }

  createSubmission() {
    return {
      problem_id: this.problem?.id || '',
      code: this.currentCodeTab?.code || '',
      language_id: this.currentCodeTab?.languageId || 71,
      user_id: this.user?.uid || '',
      source: this.currentCodeTab?.code || '',
      evaluated: false,
      score: 0,
      total_memory: 0,
      total_time: 0,
      total_score: 0,
      testcases: this.problem?.testcases || [],
      time: 0
    }
  }


}
