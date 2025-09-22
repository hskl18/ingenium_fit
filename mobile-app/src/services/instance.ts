import ky from 'ky';
import Toast from 'react-native-root-toast';

import i18n from '@/translations';

import { storage } from '@/App.tsx';
import { Configs } from '@/common/configs.ts';
import { navigateLogin } from '@/RootNavigation.ts';

// const prefixUrl = `${process.env.API_URL ?? ''}/`;
// const prefixUrl = `http://sb8766fb.natappfree.cc/`;
// const prefixUrl = `http://192.168.0.156:8080/`;
const prefixUrl = `http://47.239.182.229:81/prod-api/`;

const LocaleLanguage: Record<string, string> = {
  'en-EN': 'en_US',
};
const original = ky.create({
  timeout: 1000 * 60 * 5,
  hooks: {
    beforeRequest: [
      (request) => {
        console.log('request: ', request.url);
        const token = storage.getString(Configs.Token);
        // if(!request.url.startsWith('http') &&!request.url.startsWith('https')) {
        //   request.url = prefixUrl + request.url
        // }
        request.headers.set('Authorization', `Bearer ${token}`);
        request.headers.set('lang', LocaleLanguage[i18n.language] ?? 'en_US');
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // You could do something with the response, for example, logging.
        const json: IResponseData = await response.json();
        console.log('response json: ', json);
        if (json.code !== 200 && json.msg) {
          Toast.show(json.msg, {
            animation: true,
            delay: 0,
            duration: 1000,
            hideOnPress: true,
            position: Toast.positions.CENTER,
            shadow: true,
          });
          if (json.code === 700) {
            storage.delete(Configs.Token);
            navigateLogin();
          }
        }
      },
      (request, options, response) => {
        // if (response.status === 403) {
        //   // Get a fresh token
        //   const token = await ky('https://example.com/token').text();
        //
        //   // Retry with the token
        //   request.headers.set('Authorization', `token ${token}`);
        //
        //   return ky(request);
        // }
      },
    ],
  },
});

export const instance = original.extend({
  headers: {
    Accept: 'application/json',
  },
  prefixUrl,
});
