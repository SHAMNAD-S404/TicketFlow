import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./userSlice";
import employeeReducer from "./employeeSlice";
import sudoReducer from './sudoSlice';
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistCompanyReducer = persistReducer(persistConfig, companyReducer);
const persistEmployeeReducer = persistReducer(persistConfig, employeeReducer);
const persistSudoReducer = persistReducer(persistConfig,sudoReducer);

const store = configureStore({
  reducer: {
    company: persistCompanyReducer,
    employee: persistEmployeeReducer,
    sudo : persistSudoReducer,
  },
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
