import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getOtp } from "../thunk/authThunk";
import { applyPayloadOnState } from "../helpers/utils";

const initialState = {
  user: null,
  sessionToken: null,
  isAuthenticated: false,
  roles: [],
  activeRole: null,
  activeAccountId: null,
  totalRewardPoints: null,
  activeSociety: {},
  theme: "light",
  language: "en",
  activeServices: [],
  isClientSelectionModalOpen: false,
  userSetting: {},
  allServices: [],
  allClients: [],
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuthPayload: (state, { payload }) => {
      applyPayloadOnState(state, payload);
    },
    login: (state, { payload }) => {
      window.localStorage.setItem("sessionToken", payload.sessionToken);
      state.user = payload.user;
      state.sessionToken = payload.sessionToken;
      state.isAuthenticated = true;
      state.roles = payload.roles;
      state.activeRole = payload.activeRole;
      state.activeAccountId = payload.activeAccountId;
      state.isAdmin = !!payload.isAdmin 
    },
    logout: (state, { payload }) => {
      window.localStorage.removeItem("sessionToken");
      window.sessionStorage.clear();
      state.user = null;
      state.sessionToken = null;
      state.isAuthenticated = false;
      state.roles = null;
      state.activeRole = null;
      state.activeAccountId = null;
      state.isClientSelectionModalOpen = false;
      state.activeSociety = {};
    },
    changeSociety: (state, { payload }) => {
      state.activeRole = payload.activeRole;
      state.activeAccountId = payload.activeAccountId;
      state.activeSociety = payload.activeSociety;
    },
    changeTheme: (state, { payload }) => {
      state.theme = payload;
    },
    changeLangauge: (state, { payload }) => {
      state.language = payload;
    },
    setActiveServices: (state, { payload }) => {
      state.activeServices = payload.activeServices || [];
    },
    setClientSelectionModal: (state, { payload }) => {
      state.isClientSelectionModalOpen = !!payload.isClientSelectionModalOpen;
    },
    storeAllClients: (state, { payload }) => {
      state.allClients = payload.clients || [];
    },
    storeAllServices: (state, { payload }) => {
      state.allServices = payload.services || [];
    },
    setUserSetting: (state, { payload }) => {
      state.userSetting = payload || {};
    },
  },
});

export const {
  login,
  logout,
  changeSociety,
  setAuthPayload,
  changeTheme,
  setActiveServices,
  setClientSelectionModal,
  setUserSetting,
  changeLangauge,
  storeAllClients,
  storeAllServices,
} = authSlice.actions;

export default authSlice.reducer;
