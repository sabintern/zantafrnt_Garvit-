import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockUserProfile, defaultTimeZone } from "../../api/mockData"; // Replace with actual API imports

// Async thunk to fetch the user profile
export const fetchProfile = createAsyncThunk(
  "profileAndWorkingHours/fetchProfile",
  async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUserProfile); // Simulating profile fetch
      }, 1000); // Simulating a 1-second delay
    });
  }
);

// Async thunk to update the user profile
export const updateProfile = createAsyncThunk(
  "profileAndWorkingHours/updateProfile",
  async (profile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(profile); // Simulating profile update
      }, 1000); // Simulating a 1-second delay
    });
  }
);

const initialState = {
  profile: mockUserProfile, // Use the provided mock user profile as the initial state // Set initial state for working hours
  timeZone: defaultTimeZone, // Set the default time zone
  status: "idle", // Track status of async actions: 'idle', 'loading', 'succeeded', 'failed'
  error: null, // Any error message
};

const profileAndWorkingHoursSlice = createSlice({
  name: "profileAndWorkingHours",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateWorkingHours: (state, action) => {
      console.log(action.payload, "action.payload");
      state.profile.workingHours = action.payload.workingHours; // Set working hours directly
    },
    setTimeZone: (state, action) => {
      state.timeZone = action.payload; // Update the time zone for working hours
    },
    addTimeSlot: (state, action) => {
      const { dayIndex, newTimeSlot } = action.payload;
      state.workingHours[dayIndex].times.push(newTimeSlot); // Add new time slot for the day
    },
    removeTimeSlot: (state, action) => {
      const { dayIndex, timeIndex } = action.payload;
      state.workingHours[dayIndex].times.splice(timeIndex, 1); // Remove the time slot for the day
    },
    removeAllTimeSlots: (state, action) => {
      const { dayIndex } = action.payload;
      state.workingHours[dayIndex].times = []; // Remove all time slots for the day
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile reducers
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload; // Update profile data
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // Handle error
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload; // Update profile data after modification
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // Handle error
      });
  },
});

export const {
  setProfile,
  updateWorkingHours,
  setTimeZone, // Exporting the action to set time zone
  addTimeSlot,
  removeTimeSlot,
  removeAllTimeSlots,
} = profileAndWorkingHoursSlice.actions;

export default profileAndWorkingHoursSlice.reducer;
