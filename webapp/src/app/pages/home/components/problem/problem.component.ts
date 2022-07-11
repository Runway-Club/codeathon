import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MonacoEditorComponent, MonacoEditorConstructionOptions, MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { Store } from '@ngrx/store';
import { filter, Observable, take } from 'rxjs';
import { getProblem } from 'src/actions/problem.action';
import { Info, ProgrammingLanguage } from 'src/models/info.model';
import { Problem } from 'src/models/problem.model';
import { InfoState } from 'src/states/info.state';
import { ProblemRetrieval } from 'src/states/problem.state';
@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {

  problem$: Observable<ProblemRetrieval>;
  info$: Observable<InfoState>;
  problem?: Problem;
  info?: Info;
  constructor(private store: Store<{ problemRetrieval: ProblemRetrieval, info: InfoState }>, private monacoService: MonacoEditorLoaderService, private activatedRoute: ActivatedRoute) {
    this.problem$ = this.store.select('problemRetrieval');
    this.info$ = this.store.select('info');
  }

  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  originalCode: string = 'function x() { // TODO }';

  // @ViewChild(MonacoEditorComponent, { static: false })
  // monacoComponent: MonacoEditorComponent;

  editorOptions: MonacoEditorConstructionOptions = {
    theme: 'codeathon-theme',
    language: 'javascript',
    roundedSelection: true,
    autoIndent: 'full',
    minimap: {
      enabled: true,
      renderCharacters: false
    },
    fontSize: 15,
  };

  ngOnInit(): void {
    this.problem$.subscribe(problem => {
      if (problem.success) {
        this.problem = problem.problem;
      }
    });
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id']);
      this.store.dispatch(getProblem({ id: params['id'] }));
    });
    this.monacoService.isMonacoLoaded$
      .pipe(
        filter(isLoaded => !!isLoaded),
        take(1)
      )
      .subscribe(() => {
        this.registerMonacoCustomTheme();
      });
    this.info$.subscribe(info => {
      if (info.fetched) {
        this.info = info.info;
      }
    });
  }

  registerMonacoCustomTheme() {
    monaco.editor.defineTheme('codeathon-theme', {
      base: 'vs-dark', // can also be vs or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [
      ],
      colors: {},

    });
  }

  mergeOptions(partialOptions: any) {
    return {
      ...this.editorOptions,
      ...partialOptions
    };
  }

}
