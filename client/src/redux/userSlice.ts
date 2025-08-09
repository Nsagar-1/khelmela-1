import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: null | {
    _id: string;
    username: string;
    email: string;
    token: string;
    admin: string;
    profilePhoto: string; 
  };
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserState['user']>) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer; 