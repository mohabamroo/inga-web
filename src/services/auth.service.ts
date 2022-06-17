import {
  USER_PROFILE_LOCAL_STORAGE,
  USER_TOKEN_LOCAL_STORAGE
} from "../constants/auth.constants";
import { sendAxiosRequest as AXIOS } from "../api/index";
import { User } from "../models/user.model";

const AuthService = {
  isLoggedIn() {
    const token = localStorage.getItem(USER_TOKEN_LOCAL_STORAGE);
    return token !== null;
  },
  getCurrentUser(): User | null {
    const userString = localStorage.getItem(USER_PROFILE_LOCAL_STORAGE);

    if (userString)
      try {
        return JSON.parse(userString) as User;
      } catch (err) {
        return null;
      }
    return null;
  },

  login(email?: string, password?: string) {
    return AXIOS({
      url: "/api/auth/login",
      method: "POST",
      body: {
        email,
        password
      }
    }).then((res) => {
      const token = res.data.access_token;
      const user = res.data.user;
      console.log("🚀 ~ file: auth.service.ts ~ line 29 ~ login ~ user", user);
      localStorage.setItem(USER_TOKEN_LOCAL_STORAGE, token);
      localStorage.setItem(USER_PROFILE_LOCAL_STORAGE, JSON.stringify(user));
    });
  },

  register(formValue: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }) {
    return AXIOS({
      url: "/api/auth/register",
      method: "POST",
      body: formValue
    }).then(
      (res: {
        data: {
          access_token: string;
          user: User;
        };
      }) => {
        const token = res.data.access_token;
        localStorage.setItem(USER_TOKEN_LOCAL_STORAGE, token);
        localStorage.setItem(
          USER_PROFILE_LOCAL_STORAGE,
          JSON.stringify(res.data.user)
        );
      }
    );
  }
};

export default AuthService;
