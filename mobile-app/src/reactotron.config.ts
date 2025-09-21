import Reactotron, {
  networking,
  trackGlobalErrors,
  ReactotronReactNative,
} from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';

import config from '../app.json';
import { storage } from './App';

Reactotron.configure({
  name: config.name,
})
  .use(networking())
  .use(trackGlobalErrors())
  .useReactNative()
  .use(mmkvPlugin<ReactotronReactNative>({ storage }))
  .connect();
