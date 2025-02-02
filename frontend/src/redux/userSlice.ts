import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IAdminContext } from "../types/IAdminContext";
import { fetchUserData } from "../api/services/companyService";

//state interface
interface CompanyState {
  company: IAdminContext | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  role: null,
  loading: false,
  error: null,
};

//async thunk to fetch user data
export const fetchCompany =  createAsyncThunk(
  "company/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserData();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IAdminContext>) {
      state.company = action.payload;
      state.role = action.payload.role;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompany.fulfilled,
        (state, action: PayloadAction<IAdminContext>) => {
          state.loading = false;
          state.company = action.payload;
          state.role = action.payload.role;
        }
      )
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser } = companySlice.actions;
export default companySlice.reducer;
