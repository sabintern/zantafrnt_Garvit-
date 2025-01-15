import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import apiClient from "../../config/axios";

// Async thunk to fetch all messages (no pagination from API)
export const fetchMessages = createAsyncThunk(
  "inbox/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/call-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data?.data;
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid response structure or data is not an array");
      }

      const messages = data
        .map((entry) => {
          const call = entry?.data;
          const { structuredData } = call?.analysis||{};
          console.log(structuredData,'analysis',call)
          if (!call) {
            console.warn("Skipping entry due to missing call data:", entry);
            return null;
          }

          const formattedDate = moment(call.startedAt).format("D MMM YYYY, h:mm A");

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
                ? new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()
                : null,
              availability: "90 days",
              audioPath: call.recordingUrl,
            },
            message:
              entry?.message ||
              "Caller is calling to speak to Kelly. Please call back.",
            deliveredTo: ["support@zanta.health"],
            name: entry?.userName,
            time: formattedDate,
            analysis:call?.analysis||{"successEvaluation":'',"summary":'','structuredData':''},
            transcript:call?.transcript||'',
            preview:
              entry?.summary ||
              "Caller is calling to speak to Kelly. Please call back.",
          };
        })
       

      return {
        messages,
      };
    } catch (error) {
      console.error("Error during API call:", error.message);
      return rejectWithValue(error.message || "Failed to fetch messages");
    }
  }
);

// Initial state
const initialState = {
  allMesaages:[],
  messages: [],
  currentMessage: null,
  status: "idle",
  error: null,
  currentPage: 1, // Track current page
  pageSize: 5, // Set the default page size
};

// Inbox slice
const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    getCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
    setPagination: (state, action) => {
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.pageSize;

      // Slice messages based on pagination (calculate indices for current page)
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      state.messages = state.allMesaages.slice(startIndex, endIndex);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.allMesaages = action.payload.messages;
        // Set the initial messages to the first page
        const startIndex = 0;
        const endIndex = startIndex + state.pageSize;
        state.messages = state.allMesaages
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
export const { getCurrentMessage, setPagination } = inboxSlice.actions;
export default inboxSlice.reducer;
