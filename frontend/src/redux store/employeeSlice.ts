import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IEmployeeContext } from "../types/IEmployeeContext";
import { fetchEmployeeData } from "../api/services/companyService";

//state interface
interface EmployeeState {
  employee: IEmployeeContext | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employee: null,
  role: null,
  loading: false,
  error: null,
};

export const fetchEmployee = createAsyncThunk(
  "employee/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchEmployeeData();
      localStorage.removeItem("currentStep");
      localStorage.removeItem("email");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IEmployeeContext>) {
      state.employee = action.payload;
      state.role = action.payload.role;
    },

    clearUserData(state) {
      state.employee = null;
      state.role = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("userRole");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(
        fetchEmployee.fulfilled,
        (state, action: PayloadAction<IEmployeeContext>) => {
          state.loading = false;
          state.employee = action.payload;
          state.role = action.payload.role;
        }
      )
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUserData } = employeeSlice.actions;
export default employeeSlice.reducer;
