import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import apiClient from "../../config/axios";

// Async thunk to fetch messages
export const fetchMessages = createAsyncThunk(
  "inbox/fetchMessages",
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/call-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is included if needed
        },
      });

      // Validate and extract data
      const data = response.data?.data;
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response structure or data is not an array");
      }

      // Map and format messages
      const messages = data.map((entry) => {
        const call = entry?.data;

        // Validate call data
        if (!call) {
          console.warn("Skipping entry due to missing call data:", entry);
          return null;
        }

        const formattedDate = moment(call.startedAt).format(
          "D MMM YYYY, h:mm A"
        );

        return {
          id: call.id,
          from:
            call.type === "outboundPhoneCall"
              ? entry?.phoneNumber
              : call.customer?.number,
          to:
            call.type === "outboundPhoneCall"
              ? call.customer?.number
              : entry?.phoneNumber,
          answeredBy: `Julia H - ${formattedDate}`,
          callRecording: {
            duration: call.endedAt
              ? new Date(call.endedAt).getTime() -
                new Date(call.startedAt).getTime()
              : null,
            availability: "90 days",
            audioPath: call.recordingUrl,
          },
          message:
            entry?.message ||
            "Caller is calling to speak to Kelly. Please call back.",
          deliveredTo: [
            "support@zanta.health"
          ],
          name: entry?.userName,
          time: formattedDate,
          preview:
            entry?.summary ||
            "Caller is calling to speak to Kelly. Please call back.",
        };
      }).filter(Boolean); // Remove null entries
      return {
        messages,
        currentMessage: messages.find((msg) => msg.id === messageId) || messages[0],
      };
    } catch (error) {
      console.error("Error during API call:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch messages"
      );
    }
  }
);

// Initial state
const initialState = {
  messages: [],
  currentMessage: null,
  status: "idle",
  error: null,
};

// Inbox slice
const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    getCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.currentMessage = action.payload.currentMessage;
        state.status = "idle";
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        console.error("Failed to fetch messages:", action.payload);
        state.status = "failed";
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

// Export actions and reducer
export const { getCurrentMessage } = inboxSlice.actions;
export default inboxSlice.reducer;
