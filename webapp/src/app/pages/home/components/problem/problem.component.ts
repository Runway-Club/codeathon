import { Component, OnInit, ViewChild } from '@angular/core';
import { MonacoEditorComponent, MonacoEditorConstructionOptions, MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs';
@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {

  constructor(private monacoService: MonacoEditorLoaderService) { }

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
    this.monacoService.isMonacoLoaded$
      .pipe(
        filter(isLoaded => !!isLoaded),
        take(1)
      )
      .subscribe(() => {
        this.registerMonacoCustomTheme();
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

  public problem = {
    title: "Tính tổng 2 số",
    tags: [
      "Nhập môn lập trình",
      "Code thiếu nhi"
    ],
    author: "admin-itss@gmail.com",
    description: " A nebula is an interstellar cloud of dust, hydrogen, helium and other ionized gases. Originally, nebula was a name for any diffuse astronomical object, including galaxies beyond the Milky Way.",
    content: " A nebula is an interstellar cloud of dust, hydrogen, helium and other ionized gases. Originally, nebula was a name for any diffuse astronomical object, including galaxies beyond the Milky Way.",
    level: 5,
    samples: [
      {
        input: "1 + 2",
        output: "3"
      },
      {
        input: "999 + 1",
        output: "1000"
      },
    ],
    createDate: "1657253729835"
  }

}
