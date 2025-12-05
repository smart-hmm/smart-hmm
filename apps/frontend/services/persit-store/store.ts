export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

export enum PersitStoreKey {
  THEME = "theme",
  IS_REMEMBER = "is_remember",
  SAVED_LOGIN_INFO = "saved_login_info",
}

type LoginInfo = {
  email: string;
  password: string;
};

const isBrowser = typeof window !== "undefined";

const getSavedLoginInfo = () => {
  const loginInfo = localStorage.getItem(PersitStoreKey.SAVED_LOGIN_INFO);
  if (!loginInfo) return null;
  return JSON.parse(loginInfo) as LoginInfo;
};

export const persitStore = {
  states: {
    theme: isBrowser
      ? (localStorage.getItem(PersitStoreKey.THEME) as Theme) ?? Theme.LIGHT
      : Theme.LIGHT,
    isRemember: isBrowser
      ? localStorage.getItem(PersitStoreKey.IS_REMEMBER) === "yes"
      : false,
    savedLoginInfo: isBrowser ? getSavedLoginInfo() : null,
  },
  actions: {
    setTheme: (theme: Theme) => {
      if (!isBrowser) return;
      localStorage.setItem(PersitStoreKey.THEME, theme);
    },
    toggleRemeber: () => {
      if (!isBrowser) return;
      const curr = localStorage.getItem(PersitStoreKey.IS_REMEMBER);
      if (curr === "no") {
        localStorage.setItem(PersitStoreKey.IS_REMEMBER, "yes");
      } else {
        localStorage.setItem(PersitStoreKey.IS_REMEMBER, "no");
      }
    },
    setLoginInfo: (loginInfo: LoginInfo) => {
      if (!isBrowser) return;
      localStorage.setItem(
        PersitStoreKey.SAVED_LOGIN_INFO,
        JSON.stringify(loginInfo)
      );
    },
    removeLoginInfo: () => {
      localStorage.removeItem(PersitStoreKey.SAVED_LOGIN_INFO);
    },
  },
};
