import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    idData: null,
   
};

const editDataSlice = createSlice({
    name: 'editdata',
    initialState,
    reducers: {
        addEditData: (state, action) => {
            state.idData = action.payload;
        },
       
    },
});

export const { addEditData} = editDataSlice.actions;
export default editDataSlice.reducer;
