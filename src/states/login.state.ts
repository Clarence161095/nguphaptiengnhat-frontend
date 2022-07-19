import { atom } from 'recoil';

export const DEFAULT_LOGGED_STATE: any = {
  accessToken: '',
  email: '',
  role: '',
  logged: false,
};

export const loggedGlobalState = atom({
  key: 'loggedGlobalState',
  default: DEFAULT_LOGGED_STATE,
});
