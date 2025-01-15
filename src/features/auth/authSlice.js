import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockLogin } from "../../api/mockAuth";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await mockLogin(email, password);
      console.log("response",response);
      if (response.success) {
        return response.message;
      } else {
        console.log("response.message",response.message);
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue("Login failed. Please try again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("isAuthenticated");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        localStorage.setItem("isAuthenticated", true);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
