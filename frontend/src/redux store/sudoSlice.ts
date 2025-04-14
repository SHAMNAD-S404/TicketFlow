import { createSlice  , PayloadAction } from '@reduxjs/toolkit';
import { ISudoContext } from '../types/ISudoContext';


interface SudoState {
    sudo: ISudoContext | null ;
    role:string | null;
    loading : boolean;
    error : string | null;
}

const initialState : SudoState = {
    sudo : null,
    role : null,
    error : null,
    loading : false,
};

const sudoSlice = createSlice({
    name : "sudo",
    initialState,
    reducers :  {
        setUser(state,action:PayloadAction<ISudoContext>){
            state.sudo = action.payload;
            state.role = action.payload.role;
        },
        clearUserData(state){
            state.sudo = null;
            state.error = null;
            state.role = null;
            state.loading = false;
            localStorage.clear();
        }
    }
})

export const {  setUser , clearUserData } = sudoSlice.actions;
export default sudoSlice.reducer;