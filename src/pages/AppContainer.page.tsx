import { Route, Routes } from "react-router-dom";

import AuthService from "../services/auth.service";
import { AuthLayout } from "./AuthLayout.page";

import { NewsFeedPage } from "./Newsfeed.page";

export function AppContainer() {
  return (
    <>
      {AuthService.isLoggedIn() ? (
        <div>
          <Routes>
            <Route path="/newsfeed" element={NewsFeedPage()} />
            <Route path="*" element={NewsFeedPage()} />
          </Routes>
        </div>
      ) : (
        <div>{AuthLayout()}</div>
      )}
    </>
  );
}
