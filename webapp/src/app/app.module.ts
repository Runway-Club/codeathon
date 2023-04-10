import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';


//markdown
import { SharedMarkdownModule } from './modules/markdown/markdown.module';

//monaco
import { SharedMonacoModule } from './modules/monaco/monaco.module';

//firebase
import { SharedFirebaseModule } from './modules/firebase/shared-firebase.module';

//ngrx
import { SharedReducerModule } from './modules/ngrx/shared-reducer.module';
import { SharedEffectsModule } from './modules/ngrx/shared-effects.module';

//nebular
import { SharedNebularRootModule } from './modules/nebular/nebular-root.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    SharedFirebaseModule,
    SharedReducerModule,
    SharedEffectsModule,
    SharedNebularRootModule,
    SharedMarkdownModule,
    SharedMonacoModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
