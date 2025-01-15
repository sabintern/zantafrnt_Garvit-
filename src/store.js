import { configureStore } from "@reduxjs/toolkit";
import inboxReducer from "./features/inbox/inboxSlice";
import menuReducer from "./features/menu/menuSlice";
import authSlice from "./features/auth/authSlice";
import billingSlice from "./features/billing/billingSlice";
import profileSlice from "./features/profile/profileSlice";
import teamsSlice from "./features/team/teamSlice";

const store = configureStore({
  reducer: {
    inbox: inboxReducer,
    menu: menuReducer,
    auth: authSlice,
    billing: billingSlice,
    teams: teamsSlice,
    profile: profileSlice,
  },
});

export default store;
