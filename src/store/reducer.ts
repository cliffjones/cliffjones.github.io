import { createSlice } from '@reduxjs/toolkit';

const initialState: AppState = {
  loading: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    startLoading(state: AppState) {
      state.loading = true;
    },
    stopLoading(state: AppState) {
      state.loading = false;
    }
  }
});

export const { startLoading, stopLoading } = appSlice.actions
export default appSlice.reducer;
