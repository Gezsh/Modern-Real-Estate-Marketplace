import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    error:null,
    isLoading:false,
}

const userSlice =createSlice({
    name:"user",
    initialState,
    reducers:{
           signInStart :(state)=>{
            state.isLoading=true;
           },
           signInSuccess :(state,action)=>{
              state.currentUser=action.payload;
              console.log("currentUser",action.payload)
              state.error=null;
              state.isLoading=false;
           },
           signInFailure:(state,action)=> {
               state.error=action.payload;
               state.isLoading=false;
           },
           updateUserStart:(state)=>{
            state.isLoading=true;

           },
           updateUserSuccess:(state,action)=>{
            console.log("action",action);
            state.currentUser=action.payload;
            state.isLoading=false;
            state.error=null;
           },
           updateUserFailure:(state,action)=>{
             state.error=action.payload;
             state.isLoading=false;
           },
           deleteUserStart: (state)=>{
            state.isLoading = true;
           },
           deleteUserSuccess :(state)=>{
             state.currentUser = null;
             state.isLoading = false;
             state.error =null;

           },
           deleteUserFailure : (state,action)=>{
            state.error =action.payload;
            state.isLoading =false;
           },
           signOutUserStart: (state)=>{
            state.isLoading = true;
           },
           signOutUserSuccess :(state)=>{
             state.currentUser = null;
             state.isLoading = false;
             state.error =null;

           },
           signOutUserFailure : (state,action)=>{
            state.error =action.payload;
            state.isLoading =false;
           }

    }
});

export const {signInStart,
              signInSuccess,
              signInFailure,
              updateUserStart,
              updateUserSuccess,
              updateUserFailure,
              deleteUserStart,
              deleteUserSuccess,
              deleteUserFailure,
              signOutUserStart,
              signOutUserSuccess,
              signOutUserFailure
             }=userSlice.actions;
export default userSlice.reducer;