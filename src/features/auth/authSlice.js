import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// FakeStore API للـ Authentication
const FAKE_STORE_AUTH_API = 'https://fakestoreapi.com/auth';

// تسجيل دخول
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }) => {
    try {
      const response = await axios.post(`${FAKE_STORE_AUTH_API}/login`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }
);

// تسجيل مستخدم جديد
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData) => {
    try {
      const response = await axios.post('https://fakestoreapi.com/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }
);

// الحصول على بيانات المستخدم
export const getUserProfile = createAsyncThunk(
  'auth/getProfile',
  async (userId) => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
    isLoading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userCart');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // تسجيل الدخول
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.token = action.payload.token;
        
        // حفظ بيانات المستخدم (في حالة FakeStore، الـ token يحتوي على user id)
        const user = {
          id: action.payload.userId || 1,
          username: action.meta.arg.username,
          token: action.payload.token
        };
        state.user = user;
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // التسجيل
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.user = {
          id: action.payload.id,
          username: action.meta.arg.username,
          email: action.meta.arg.email || '',
        };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // الحصول على الملف الشخصي
      .addCase(getUserProfile.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;