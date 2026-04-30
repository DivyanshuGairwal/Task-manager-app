import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestOtp = createAsyncThunk(
  'auth/requestOtp',
  async (phone, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/request-otp', { phone });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to request OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem('userToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to verify OTP');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
      await AsyncStorage.removeItem('userToken');
    }
  } catch (e) {
    console.warn('Logout storage error:', e);
  }
});

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  otpRequested: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpRequested = true;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.otpRequested = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.otpRequested = false;
      });
  },
});

export const { setToken, clearError } = authSlice.actions;
export default authSlice.reducer;
