import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/coursedescription/CourseDescription";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashbord from "./pages/dashbord/Dashbord";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";
import AdminDashbord from "./admin/Dashboard/AdminDashbord";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import LiveSession from './pages/Livesessions/liveSession';
import Rewards from "./pages/rewards/Rewards";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { isAuth, user, loading } = UserData();

  const isAdminRoute = (pathname) => {
    return pathname.startsWith("/admin");
  };

  if (loading) return <Loading />;

  return (
    <>
      {!isAdminRoute(window.location.pathname) && <Header isAuth={isAuth} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route
          path="/account"
          element={isAuth ? <Account user={user} /> : <Login />}
        />
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route
          path="/register"
          element={isAuth ? <Home /> : <Register />}
        />
        <Route
          path="/verify"
          element={isAuth ? <Home /> : <Verify />}
        />
        <Route
          path="/course/:id"
          element={<CourseDescription />}
        />
        <Route
          path="/payment-success/:id"
          element={isAuth ? <PaymentSuccess user={user} /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={isAuth ? <Dashbord user={user} /> : <Login />}
        />
        <Route
          path="/course/study/:id"
          element={isAuth ? <CourseStudy user={user} /> : <Login />}
        />
        <Route
          path="/lecture/:id"
          element={isAuth ? <Lecture user={user} /> : <Login />}
        />
        <Route
          path="/admin/dashboard"
          element={isAuth ? <AdminDashbord user={user} /> : <Login />}
        />
        <Route
          path="/live-session"
          element={isAuth && user.role === "admin" ? <LiveSession /> : <Login />}
        />
        <Route
          path="/admin/course"
          element={isAuth ? <AdminCourses user={user} /> : <Login />}
        />
        <Route
          path="/admin/users"
          element={isAuth ? <AdminUsers user={user} /> : <Login />}
        />
      </Routes>
      {!isAdminRoute(window.location.pathname) && <Footer />}
      <Toaster />
    </>
  );
};

export default App;
