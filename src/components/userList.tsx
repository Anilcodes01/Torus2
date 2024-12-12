import React, { useEffect, useState } from "react";
import { Search, Dot, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  setPagination,
  filterUsers,
  filterActiveUsers,
  filterInactiveUsers,
} from "../store/slices/userSlice";
import { AppDispatch } from "../store/store";
import { RootState } from "../store/store";
import { FaArrowDown } from "react-icons/fa6";

export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  avatarUrl: string;
  dateJoined: string;
  region: string;
}

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, pagination, filteredUsers } = useSelector(
    (state: RootState) => state.users
  );

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchUsers(pagination.currentPage));
  }, [dispatch, pagination.currentPage]);

  useEffect(() => {
    if (searchQuery) {
      dispatch(filterUsers(searchQuery));
    } else {
      dispatch(filterUsers(""));
    }
  }, [dispatch, searchQuery]);

  const handleDelete = (userId: number) => {
    dispatch(deleteUser(userId));
  };

  const handlePageChange = (page: number) => {
    dispatch(
      setPagination({ currentPage: page, totalPages: pagination.totalPages })
    );
  };

  const handleFilterActive = () => {
    dispatch(filterActiveUsers());
  };

  const handleFilterInactive = () => {
    dispatch(filterInactiveUsers());
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="p-4 bg-customBackgroundColour rounded-lg shadow-lg">
        <h2 className="text-lg sm:text-xl mb-4 flex flex-wrap justify-between text-customAccent">
          <span className="font-bold text-black">Members</span>
          <div className="flex gap-2 sm:gap-4">
            <button
              className="border text-black text-sm p-1 rounded-lg px-2"
              onClick={handleFilterActive}
            >
              Show Active Users
            </button>
            <button
              className="border p-1 rounded-lg px-2 text-black text-sm"
              onClick={handleFilterInactive}
            >
              Show Inactive Users
            </button>
          </div>
        </h2>

        <div className="flex items-center border rounded-lg p-2 w-full mb-6 shadow-sm">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 w-full text-gray-700 text-sm outline-none"
          />
        </div>

        <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr] items-center bg-customAccent text-black py-2 px-4 rounded-lg">
          <div className="flex items-center gap-2">
            Member <FaArrowDown />
          </div>
          <div>Status</div>
          <div className="text-center">Enrolled</div>
          <div className="text-end">Action</div>
        </div>

        <div className="mt-4 space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="grid sm:grid-cols-[3fr_1fr_1fr_1fr] items-center p-2 bg-white rounded-lg shadow-sm sm:shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  className="rounded-full h-10 w-10 sm:h-12 sm:w-12 shadow"
                  src={user.avatarUrl}
                  alt="User Avatar"
                />
                <div>
                  <span className="font-medium text-black block truncate">
                    {user.name}
                  </span>
                  <span className="text-sm text-gray-500 truncate">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="mt-2 sm:mt-0 text-gray-500 flex items-center sm:text-center">
                {user.isActive ? (
                  <span className="border rounded-full w-20 flex items-center justify-center text-sm border-gray-600">
                    <Dot className="text-yellow-500" />
                    Active
                  </span>
                ) : (
                  <span className="border rounded-full w-20 flex items-center justify-center text-sm border-gray-600">
                    <Dot className="text-gray-500" />
                    Inactive
                  </span>
                )}
              </div>

              <div className="hidden sm:block text-gray-500 text-sm text-center">
                {user.dateJoined}
              </div>

              <div className="flex justify-end sm:w-full mt-2 sm:mt-0">
                <Trash2
                  onClick={() => handleDelete(user.id)}
                  size={20}
                  className="text-gray-600 hover:text-gray-700 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
          <button
            className="border w-full sm:w-20 p-1 px-2 rounded-lg text-sm"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            className="border w-full sm:w-20 p-1 px-2 rounded-lg text-sm"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
