import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import usersData from "../../mock/user";

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  avatarUrl: string;
  dateJoined: string;
  region: string;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    perPage: number;
  };
  filteredUsers: User[];
  deletedUsers: number[];
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 5,
  },
  filteredUsers: [],
  deletedUsers: [],
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page: number, { getState, rejectWithValue }: any) => {
    try {
      const {
        users: { deletedUsers },
      } = getState();
      const filteredData = usersData.filter(
        (user) => !deletedUsers.includes(user.id)
      );
      const paginatedUsers = filteredData.slice((page - 1) * 5, page * 5);
      const totalPages = Math.ceil(filteredData.length / 5);

      return { users: paginatedUsers, totalPages };
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    selectUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.deletedUsers.push(action.payload);
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.filteredUsers = state.filteredUsers.filter(
        (user) => user.id !== action.payload
      );
    },

    setPagination: (
      state,
      action: PayloadAction<{ currentPage: number; totalPages: number }>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    filterUsers: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      state.filteredUsers = query
        ? state.users.filter(
            (user) =>
              user.name.toLowerCase().includes(query) ||
              user.email.toLowerCase().includes(query)
          )
        : [...state.users];
    },

    filterActiveUsers: (state) => {
      state.filteredUsers = state.users.filter((user) => user.isActive);
    },
    filterInactiveUsers: (state) => {
      state.filteredUsers = state.users.filter((user) => !user.isActive);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.filteredUsers = action.payload.users;
        state.pagination.totalPages = action.payload.totalPages;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectUser,
  deleteUser,
  setPagination,
  filterUsers,
  filterActiveUsers,
  filterInactiveUsers,
} = userSlice.actions;

export default userSlice.reducer;
