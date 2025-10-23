import { createSlice } from "@reduxjs/toolkit";

const editDataSlice = createSlice({
  name: "editdata",
  initialState: null,
  reducers: {
    addEditData: (state, action) => {
      return action.payload;
    },
  },
});

export const { addEditData } = editDataSlice.actions;
export default editDataSlice.reducer;
