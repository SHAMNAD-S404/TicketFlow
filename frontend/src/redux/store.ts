import {configureStore} from "@reduxjs/toolkit"
import companyReducer from './userSlice';
import employeeReducer from './employeeSlice';


const store = configureStore({
    reducer : {
        company : companyReducer,
        employee : employeeReducer,
    }
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;