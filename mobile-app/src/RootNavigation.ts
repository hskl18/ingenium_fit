import { createNavigationContainerRef } from '@react-navigation/native';
import { Paths } from '@/navigation/paths.ts';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
export function navigateLogin() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: Paths.Login }],
    });
  }
}
