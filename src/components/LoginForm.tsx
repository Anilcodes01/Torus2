import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authenticationSlice";
import { useNavigate } from "react-router-dom";

interface RootState {
  authentication: {
    isAuthenticated: boolean;
    error: string | null;
  };
}

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isAuthenticated } = useSelector(
    (state: RootState) => state.authentication
  );

  useEffect(() => {
    if (isAuthenticated || localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    dispatch(login({ email }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <p className="mb-4 font-bold">Use data from mock/user.ts file to Login</p>
      <div className="bg-white p-8  rounded-2xl shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome back!</h1>
        <div className="flex flex-col space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="rounded-lg border border-gray-300 outline-none p-2 focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="rounded-lg text-white p-2 bg-blue-500 hover:bg-blue-600 transition-colors"
            onClick={handleLogin}
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
