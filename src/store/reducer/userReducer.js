import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  email: "",
  company: {},
  lang: "",
  role: "employer",
  sideNav: false,
  isDefaultPasswordChanged: undefined,
  manages: null,
  type_employer: null,
  advances: [],
};

export const UserSlice = createSlice({
  name: "userInfos",
  initialState,
  reducers: {
    setPasswordChanged: (state, action) => {
      state.isDefaultPasswordChanged = action.payload;
    },
    changeLang: (state, action) => {
      state.lang = action.payload;
    },
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.type_employer = action.payload.type_employer;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.hash = action.payload.hash;
      state.phone = action.payload.phone;
      state.address = action.payload.address;
      state.company = action.payload.company;
      state.role = action.payload.role ? action.payload.role : "employer";
      state.lang = action.payload.lang ? action.payload.lang : "fr";
      state.isAllowedToSeeHistory = action.payload.isAllowedToSeeHistory;
      state.isDefaultPasswordChanged = action.payload.isDefaultPasswordChanged;
      state.manages = action.payload.manages;
    },
    setOpen: (state, action) => {
      state.sideNav = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
    setLogout: (state) => {
      return initialState;
    },
    setAdvances: (state, action) => {
      state.advances = action.payload;
    },
    updateAdvanceByIndex: (state, action) => {
      const { index, newValue } = action.payload;
      state.advances[index] = newValue;
    },
    removeItemElement(state, action) {
      const element = action.payload;
      state.advances = state.advances.filter(
        (item) =>
          item.firstName !== element.firstName &&
          item.firstName !== element.lastName
      );
    },
  },
});

export const {
  changeLang,
  setUser,
  setOpen,
  setRole,
  setLanguage,
  setLogout,
  setPasswordChanged,
  setAdvances,
  updateAdvanceByIndex,
  removeItemElement,
} = UserSlice.actions;

export default UserSlice.reducer;
