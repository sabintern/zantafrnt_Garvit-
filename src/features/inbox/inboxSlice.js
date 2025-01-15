import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { messages, messageDetails } from "../../api/mockData";
import apiClient from "../../config/axios";
import moment from "moment";

// Async Thunk to Fetch Messages
// export const fetchMessages = createAsyncThunk(
//   "inbox/fetchMessages",
//   async (amount) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         try {
//           const mockData = { messages, messageDetails };
//           resolve({
//             messages: mockData.messages,
//             currentMessage: mockData.messageDetails[amount],
//           });
//         } catch (error) {
//           reject("Error fetching messages");
//         }
//       }, 1500);
//     });
//   }
// );

export const fetchMessages = createAsyncThunk(
  "inbox/fetchMessages",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/call-data");

      // Extract messages and call details
      const data = response.data?.data;

      console.log("data", data);

      const messages = data.map((data) => {
        let call = data?.data;
        const time = new Date(call.startedAt).toLocaleString();
        const preview =
          call.transcript.length > 50
            ? call.transcript.slice(0, 50) + "..."
            : call.transcript;

        console.log("call", call);
        // Convert the UTC date to a Moment object
        const specificDate = moment(call.startedAt);

        // Format the date as "3 Jan 2025, 8:49 AM"
        const formattedDate = specificDate.format("D MMM YYYY, h:mm A");
        return {
          id: call.id,
          from: call.type == "outboundPhoneCall" ?  data?.phoneNumber : call.customer?.number  ,
          to:  call.type == "outboundPhoneCall" ? call.customer?.number : data?.phoneNumber,
          answeredBy: `Julia H - ${formattedDate}`,
          callRecording: {
            duration: call.endedAt
              ? new Date(call.endedAt).getTime() -
                new Date(call.startedAt).getTime()
              : null,
            availability: "90 days",
            audioPath: call.recordingUrl,
          },
          message: data?.message || "Caller is calling to speak to Kelly. Please call back.",
          deliveredTo: ["ashley@fitpeo.com", "shashank@fitpeo.com"],
          name: data?.userName,
          time: formattedDate,
          preview:
            data?.summary ||
            "Caller is calling to speak to Kelly. Please call back.",
          // id: call.id,
          // name: call.customer?.number || "Unknown",
          // time,
          // preview,
          // id: call.id,
          // type: call.type,
          // transcript: call.transcript,
          // summary: call.summary,
          // startedAt: call.startedAt,
          // endedAt: call.endedAt,
          // customerNumber: call.customer?.number,
          // recordingUrl:  call.recordingUrl,
          // stereoRecordingUrl: call.stereoRecordingUrl,
          // status: call.status,
          // callDuration: call.endedAt
          //   ? new Date(call.endedAt).getTime() -
          //     new Date(call.startedAt).getTime()
          //   : null,
        };
      });

      console.log("messages", messages);

      // Map API response to the app's expected structure
      // const messages = data.map((call) => ({
      //   id: call.id,
      //   type: call.type,
      //   transcript: call.transcript,
      //   summary: call.summary,
      //   startedAt: call.startedAt,
      //   endedAt: call.endedAt,
      //   customerNumber: call.customer?.number,
      //   recordingUrl: call.recordingUrl,
      //   stereoRecordingUrl: call.stereoRecordingUrl,
      //   status: call.status,
      //   callDuration: call.endedAt
      //     ? new Date(call.endedAt).getTime() -
      //       new Date(call.startedAt).getTime()
      //     : null,
      // }));

      // Return the messages and set the current message if available
      return {
        messages,
        currentMessage: messages.find((d) => d.id === amount) || messages[0],
      };
    } catch (error) {
      // Use rejectWithValue to pass the error to the rejected action
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch messages"
      );
    }
  }
);

// Initial State
const initialState = {
  messages: [],
  currentMessage: null,
  status: "idle",
};

// Inbox Slice
const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    getCurrentMessage: (state, action) => {
      state.currentMessage = action.payload; // Set the current message based on user action
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading"; // Update status to loading
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages; // Populate messages
        state.currentMessage = action.payload.currentMessage; // Set the current message
        state.status = "idle"; // Reset status
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.status = "failed"; // Set status to failed in case of error
      });
  },
});

export const { getCurrentMessage } = inboxSlice.actions;
export default inboxSlice.reducer;
