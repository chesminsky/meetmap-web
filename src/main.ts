import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
  console.log('meetmap starting...');
  console.log('server url is: ', environment.baseUrl);
  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
}


const addSript = (baseUrl, url) => {
  return new Promise(function(resolve, reject) {

    const el = document.createElement('script');
    el.src = baseUrl + url;
    document.body.appendChild(el);

    el.onload = function() {
      resolve(url);
    };

    el.onerror = function() {
      reject(url);
    };
  });
}

addSript(environment.baseUrl, 'socket.io/socket.io.js').then(() => {
  if (window.cordova) {
    document.addEventListener('deviceready', () => {
      console.log('device ready');
      bootstrap();
    });
    
  } else {
    console.log('cordova not found');
    bootstrap();
  }
});


