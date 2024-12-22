import { createSlice } from "@reduxjs/toolkit";
import NavBarData from "../../Data/NavBarData";

const CurrentPageSlice = createSlice({
    name: "CurrentPage",
    initialState: {
        currentPage: 0,
    },
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }

    }
})

export const {setCurrentPage} = CurrentPageSlice.actions;

export default CurrentPageSlice.reducer;
