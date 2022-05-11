export const environment = {
  firebase: {
    projectId: 'chefsito-bot',
    appId: '1:1029740896252:web:8805d52ffea5de23411c79',
    storageBucket: 'chefsito-bot.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyCiFEVZZtuEXaG67xsTzJNk1avtk61qwQ8',
    authDomain: 'chefsito-bot.firebaseapp.com',
    messagingSenderId: '1029740896252',
  },

  googleWebClientID: '1029740896252-5aakpdrvq60sfkicn8jo05ev33l80lmg.apps.googleusercontent.com',
  
  stringRegex: {
    fullName: '[a-zA-ZÀ-ÿ\u00f1\u00d1][a-zA-ZÀ-ÿ\u00f1\u00d1 ]*',
    username: '[a-zA-ZÀ-ÿ\u00f1\u00d10-9_][a-zA-ZÀ-ÿ\u00f1\u00d10-9_ ]*',
    noSpace: '^[^\\s]*$',
  },

  production: true
}