import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from 'src/reducers/auth.reducer';
import { deleteProblemReducer, listingProblemReducer, problemCreationReducer, problemRetrievalReducer, problemUpdationReducer, resetSubmissionsReducer } from '../reducers/problem.reducer';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';
import { AuthEffects } from 'src/effects/auth.effect';
import { ProblemEffects } from 'src/effects/problem.effect';
import { profileReducer } from 'src/reducers/profile.reducer';
import { ProfileEffects } from 'src/effects/profile.effect';
import { HttpClientModule } from '@angular/common/http';
import { infoReducer } from 'src/reducers/info.reducer';
import { InfoEffects } from 'src/effects/info.effect';
import { exEcutionReducer, submitReducer } from 'src/reducers/submit.reducer';
import { SubmitEffects } from 'src/effects/submit.effect';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    providePerformance(() => getPerformance()),
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'corporate' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbToastrModule.forRoot(),
    StoreModule.forRoot({
      auth: authReducer,
      problemCreation: problemCreationReducer,
      problemUpdation: problemUpdationReducer,
      problemRetrieval: problemRetrievalReducer,
      problemDeletion: deleteProblemReducer,
      problemResetSubmissions: resetSubmissionsReducer,
      problemListing: listingProblemReducer,
      profile: profileReducer,
      info: infoReducer,
      submit: submitReducer,
      exEcution: exEcutionReducer
    }, {}),
    EffectsModule.forRoot([
      AuthEffects,
      ProblemEffects,
      ProfileEffects,
      InfoEffects,
      SubmitEffects
    ]),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    }),
    LMarkdownEditorModule,
    MonacoEditorModule,
    HttpClientModule
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    MarkdownService,
    {
      provide: MONACO_PATH,
      useValue: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.32.0/min/vs',
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
