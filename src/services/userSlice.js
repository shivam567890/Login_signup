import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: localStorage.getItem('loggedIn') === 'true', // Check local storage for initial state
  userData: JSON.parse(localStorage.getItem('userData')) || null, // Parse and set initial user data
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
      localStorage.setItem('loggedIn', true);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null;
      localStorage.removeItem('userData');
      localStorage.removeItem('loggedIn');
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
