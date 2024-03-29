// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'codeathon-standalone',
    appId: '1:893549035333:web:359525ae034db0d360082c',
    storageBucket: 'codeathon-standalone.appspot.com',
    apiKey: 'AIzaSyA6MZp6pVo_CSTzU6pVSSxp-CLQgIWtoD8',
    authDomain: 'codeathon-standalone.firebaseapp.com',
    messagingSenderId: '893549035333',
  },
  //api: 'https://codeathon-server-cuvoajx6da-as.a.run.app/api/v1',
  api: 'http://localhost:8080/api/v1',
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
