import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockTeamData, defaultTimeZone } from "../../api/mockData"; // Replace with actual API imports

// Async thunk to fetch teams
export const fetchTeams = createAsyncThunk("teams/fetchTeams", async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTeamData); // Replace with actual API call logic
    }, 1000);
  });
});

// Async thunk to add a team member
export const addTeamMembers = createAsyncThunk(
  "teams/addTeamMembers",
  async (newMember) => {
    // Replace this with an actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (newMember) {
          resolve(newMember);
        } else {
          reject(new Error("Failed to add team member"));
        }
      }, 1000);
    });
  }
);

const teamsSlice = createSlice({
  name: "teams",
  initialState: {
    members: [], // Unified state for both fetched teams and added members
    loading: false,
    error: null,
    timeZone: defaultTimeZone, // Default time zone for working hours
  },
  reducers: {
    resetMembers: (state) => {
      state.members = [];
    },
    updateWorkingHours: (state, action) => {
      const { id, workingHours, timeZone } = action.payload;
      console.log("Action Payload:", action.payload);
      console.log("State before update:", state.members);

      state.members = state.members.map((member) => {
        if (member.id === id) {
          console.log("Updating member with ID:", id);
          return {
            ...member,
            workingHours: workingHours,
            timeZone: timeZone, // Update workingHours and timeZone
          };
        }
        return member;
      });

      console.log("State after update:", state.members);
    },
    setTimeZone: (state, action) => {
      state.timeZone = action.payload; // Update the time zone for working hours
    },
  },
  extraReducers: (builder) => {
    // Fetch teams
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload; // Initialize with fetched team data
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Add a team member
    builder
      .addCase(addTeamMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = [...state.members, action.payload]; // Append new member to existing list
      })
      .addCase(addTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  resetMembers,
  updateWorkingHours, // Export the action to update working hours
  setTimeZone, // Export the action to set time zone
} = teamsSlice.actions;

export default teamsSlice.reducer;
