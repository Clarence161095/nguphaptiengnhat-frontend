/* eslint-disable react-hooks/exhaustive-deps */
import { useLoggedHook } from './logged.hook';

export function useCheckRole() {
  const [loggedState] = useLoggedHook();

  const checkRole = (type: string) => {
    switch (type) {
      case 'general':
        return loggedState?.role === 'user' || loggedState?.role === 'admin';
      default:
        return false;
    }
  };

  return [checkRole];
}
