import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import usersData from "../../mock/user";

import { RootState } from "../store";

interface AnalyticsState {
  totalUsers: number;
  activeUsers: number;
  deletedUsers: number;
  userRegistrationTrend: number[];
  activeVsInactive: { active: number; inactive: number };
  usersByRegion: Record<string, number>;
  filters: { dateRange: string; region: string };
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  totalUsers: 0,
  activeUsers: 0,
  deletedUsers: 0,
  userRegistrationTrend: [],
  activeVsInactive: { active: 0, inactive: 0 },
  usersByRegion: {},
  filters: { dateRange: "", region: "" },
  loading: false,
  error: null,
};

export const fetchAnalyticsData = createAsyncThunk(
  "analytics/fetchAnalyticsData",
  async (_, { dispatch, getState }) => {
    try {
      const { filters } = (getState() as RootState).analytics;

      dispatch(applyFilters());

      const filteredData = usersData.filter((user) => {
        const dateInRange = filters.dateRange
          ? new Date(user.dateJoined).getFullYear() ===
            parseInt(filters.dateRange)
          : true;
        const regionMatches = filters.region
          ? user.region === filters.region
          : true;
        return dateInRange && regionMatches;
      });

      const totalUsers = filteredData.length;
      const activeUsers = filteredData.filter((user) => user.isActive).length;
      const deletedUsers = 0;

      const userRegistrationTrend = filteredData.map((user) =>
        new Date(user.dateJoined).getMonth()
      );
      const activeVsInactive = {
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      };

      const usersByRegion = filteredData.reduce((acc, user) => {
        acc[user.region] = (acc[user.region] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      dispatch(
        fetchAnalyticsSuccess({
          totalUsers,
          activeUsers,
          deletedUsers,
          userRegistrationTrend,
          activeVsInactive,
          usersByRegion,
          filters: { dateRange: "", region: "" },
          loading: false,
          error: null,
        })
      );
    } catch (error) {
      dispatch(fetchAnalyticsFailure("Failed to fetch analytics data"));
    }
  }
);

export const applyFiltersThunk = createAsyncThunk(
  "analytics/applyFilters",
  async (filters: { dateRange: string; region: string }, { dispatch }) => {
    try {
      dispatch(setFilters(filters));
      dispatch(fetchAnalyticsData());
    } catch (error) {
      console.error("Failed to apply filters:", error);
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{ dateRange: string; region: string }>
    ) => {
      state.filters = action.payload;
    },
    fetchAnalyticsSuccess: (state, action: PayloadAction<AnalyticsState>) => {
      const {
        totalUsers,
        activeUsers,
        deletedUsers,
        userRegistrationTrend,
        activeVsInactive,
        usersByRegion,
        filters,
        loading,
        error,
      } = action.payload;
      state.totalUsers = totalUsers;
      state.activeUsers = activeUsers;
      state.deletedUsers = deletedUsers;
      state.userRegistrationTrend = userRegistrationTrend;
      state.activeVsInactive = activeVsInactive;
      state.usersByRegion = usersByRegion;
      state.filters = filters;
      state.loading = loading;
      state.error = error;
    },
    fetchAnalyticsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    applyFilters: (state) => {
      state.loading = true;
    },
  },
});

export const {
  setFilters,
  fetchAnalyticsSuccess,
  fetchAnalyticsFailure,
  applyFilters,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
