import {configureStore} from "@reduxjs/toolkit"
import companyReducer from './userSlice';


const store = configureStore({
    reducer : {
        company : companyReducer,
    }
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;