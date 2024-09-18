import { createSlice } from "@reduxjs/toolkit";

export const rightDrawerSlice = createSlice({
  name: "rightDrawer",
  initialState: {
    isOpen: false, // right drawer state management for opening closing
    refetchNotifFlag: false,
  },

  reducers: {
    setNotifRefetchFlag: (state, { payload }) => {
      state.refetchNotifFlag = payload;
    },
    openRightDrawer: (state) => {
      state.isOpen = true;
    },
    closeRightDrawer: (state) => {
      state.isOpen = false;
    },
    toggleRightDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  openRightDrawer,
  closeRightDrawer,
  toggleRightDrawer,
  setNotifRefetchFlag,
} = rightDrawerSlice.actions;

export default rightDrawerSlice.reducer;
