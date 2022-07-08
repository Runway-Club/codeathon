import { NgModule } from '@angular/core';
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
import { deleteProblemReducer, problemCreationReducer, problemRetrievalReducer, problemUpdationReducer, resetSubmissionsReducer } from '../reducers/problem.reducer';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { AuthEffects } from 'src/effects/auth.effect';
import { ProblemEffects } from 'src/effects/problem.effect';
import { profileReducer } from 'src/reducers/profile.reducer';

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
      profile: profileReducer
    }, {}),
    EffectsModule.forRoot([
      AuthEffects,
      ProblemEffects
    ]),
    MarkdownModule.forRoot(),
    LMarkdownEditorModule
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    MarkdownService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
