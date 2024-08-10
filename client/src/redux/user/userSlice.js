import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:null,
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInSuccess:(state,action)=>{
            state.user=action.payload;
        },
        signOut:(state)=>
        {
            state.user=null;
        }
    }
})


export const{signInSuccess,signOut}=userSlice.actions;
export default userSlice.reducer;