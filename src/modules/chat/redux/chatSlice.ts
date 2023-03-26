import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

export interface ChatState {
  socket: Socket | null;
}

const initialState: ChatState = {
  socket: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // connectSocket: (state, action: PayloadAction<Socket>) => {
    //   state.socket = action.payload;
    // },
    disconnectSocket: (state) => {
      state.socket = null;
    },
  },
});

export const chatAction = chatSlice.actions;

const chatReducer = chatSlice.reducer;
export default chatReducer;
