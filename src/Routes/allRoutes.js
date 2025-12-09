import React from "react";
import { Navigate } from "react-router-dom";
import DashboardEcommerce from "../pages/DashboardEcommerce";

import ExploreNow from "../pages/NFTMarketplace/ExploreNow";
//login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import Courses from "../pages/Courses";
import CreateCourse from "../pages/Courses/CreateCourse";
import CourseDetail from "../pages/Courses/CourseDetail";

const authProtectedRoutes = [
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/courses", component: <Courses /> },
  { path: "/create-course", component: <CreateCourse /> },
  { path: "/update-course/:courseId", component: <CreateCourse /> },
  { path: "/course-details/:courseId", component: <CourseDetail /> },

 
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  // //AuthenticationInner pages
  // { path: "/auth-signin-basic", component: <BasicSignIn /> },
  // { path: "/auth-signin-cover", component: <CoverSignIn /> },
  // { path: "/auth-signup-basic", component: <BasicSignUp /> },
  // { path: "/auth-signup-cover", component: <CoverSignUp /> },
  // { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  // { path: "/auth-pass-reset-cover", component: <CoverPasswReset /> },
  // { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  // { path: "/auth-lockscreen-cover", component: <CoverLockScreen /> },
  // { path: "/auth-logout-basic", component: <BasicLogout /> },
  // { path: "/auth-logout-cover", component: <CoverLogout /> },
  // { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  // { path: "/auth-success-msg-cover", component: <CoverSuccessMsg /> },
  // { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  // { path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  // { path: "/auth-404-basic", component: <Basic404 /> },
  // { path: "/auth-404-cover", component: <Cover404 /> },
  // { path: "/auth-404-alt", component: <Alt404 /> },
  // { path: "/auth-500", component: <Error500 /> },
  // { path: "/pages-maintenance", component: <Maintenance /> },
  // { path: "/pages-coming-soon", component: <ComingSoon /> },

  // { path: "/landing", component: <OnePage /> },
  // { path: "/nft-landing", component: <NFTLanding /> },
  // { path: "/job-landing", component: <JobLanding /> },

  // { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  // { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  // { path: "/auth-offline", component: <Offlinepage /> },

];

export { authProtectedRoutes, publicRoutes };