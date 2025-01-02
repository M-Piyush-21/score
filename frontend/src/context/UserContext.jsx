import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const UserContext = createContext();

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : {
    'Content-Type': 'application/json'
  };
};

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginUser(email, password, navigate, fetchMyCourse) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      if (fetchMyCourse) fetchMyCourse();
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      const errorMessage = error.response?.data?.message || "Login failed"; 
      toast.error(errorMessage);
    }
  }

  async function logoutUser(navigate) {
    try {
      // Clear all auth data
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      
      // Reset context
      setUser(null);
      setIsAuth(false);
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Navigate to home page
      navigate("/", { replace: true });
      
      // Force a page reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  }

  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      const errorMessage = error.response?.data?.message || "Registration failed"; 
      toast.error(errorMessage);
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });

      toast.success(data.message);
      navigate("/login");
      localStorage.removeItem("activationToken");
      setBtnLoading(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "OTP verification failed"; 
      toast.error(errorMessage);
      console.log(errorMessage);
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      return; 
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: getAuthHeaders()
      });

      if (data.success === false) {
        setLoading(false);
        return;
      }

      setUser(data.user);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        btnLoading,
        setBtnLoading,
        loading,
        loginUser,
        logoutUser,
        registerUser,
        verifyOtp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const UserData = () => {
  return useContext(UserContext);
};

export { getAuthHeaders };
