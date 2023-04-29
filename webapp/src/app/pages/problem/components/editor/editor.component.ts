import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  MonacoEditorConstructionOptions,
  MonacoEditorLoaderService
} from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import { Problem } from 'src/models/problem.model';
import { CodeTab, DefaultCodes, CodeMap } from 'src/models/code.model';

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

  editor?: any;
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

  editorInit(editor: any) {
    this.editor = editor;
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
      currentLanguageID: 71,
      codes: DefaultCodes,
    }

    this.codeTabs.push(newTab);
    this.currentCodeTab = newTab;
    this.currentCodeTab.currentCode = this.getCode(this.currentCodeTab);
  }

  getCode(currentCodeTab: CodeTab) {
    const { currentLanguageID: languageID, codes } = currentCodeTab;

    let tempCode = codes.find(element => element.languageID === languageID);

    if (tempCode) {
      return tempCode.code;
    }

    return "";
  }

  updateCode(currentCodeTab: CodeTab) {
    const { currentLanguageID: languageID, currentCode, codes } = currentCodeTab;

    let tempCode = codes.find(element => element.languageID === languageID);

    if (tempCode) {
      tempCode.code = currentCode || "";
    }
  }

  handleChangeLanguage(languageID: number) {
    if (!this.currentCodeTab) return;

    this.updateCode(this.currentCodeTab);

    this.currentCodeTab.currentLanguageID = languageID;
    this.currentCodeTab.currentCode = this.getCode(this.currentCodeTab);

    let newLanguage = CodeMap[languageID as keyof typeof CodeMap];
    console.log(newLanguage)
    monaco.editor.setModelLanguage(this.editor.getModel(), newLanguage);
  }

  handleChangeTab(id: number) {
    let tempTab = this.codeTabs.find(element => element.id === id);

    if (tempTab) {
      this.updateCode(this.currentCodeTab!);
      this.editor.updateOptions(this.editorOptions);
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
    const { currentLanguageID, currentCode, codes } = this.currentCodeTab!;
    const { uid } = this.user!;
    const { id, testcases } = this.problem!;

    return {
      problem_id: id || '',
      code: currentCode || '',
      language_id: currentLanguageID || 71,
      user_id: uid || '',
      source: currentCode || '',
      evaluated: false,
      score: 0,
      total_memory: 0,
      total_time: 0,
      total_score: 0,
      testcases: testcases || [],
      time: 0
    }
  }

}
