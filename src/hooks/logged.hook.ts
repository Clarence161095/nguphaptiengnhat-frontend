/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import AuthApi from '../api/auth.api';
import { DEFAULT_LOGGED_STATE, loggedGlobalState } from '../states/login.state';

export function useLoggedHook() {
  const [loggedState, setLoggedState] = useRecoilState(loggedGlobalState);

  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      const _fetch = async () => {
        try {
          const resultGetToken: any = await AuthApi.getToken();

          if (resultGetToken.data.data.attributes) {
            localStorage.setItem(
              'email',
              resultGetToken.data.data.attributes['email']
            );
            localStorage.setItem(
              'role',
              resultGetToken.data.data.attributes['role']
            );
            setLoggedState({
              accessToken: localStorage.getItem('access-token'),
              email: resultGetToken.data.data.attributes['email'],
              role: resultGetToken.data.data.attributes['role'],
              logged: true,
            });
          } else {
            setLoggedState(DEFAULT_LOGGED_STATE);
          }
        } catch (error) {
          setLoggedState(DEFAULT_LOGGED_STATE);
          localStorage.clear();
        }
      };
      _fetch();
    } else {
      setLoggedState(DEFAULT_LOGGED_STATE);
      localStorage.clear();
    }
  }, []);

  return [loggedState, setLoggedState];
}
