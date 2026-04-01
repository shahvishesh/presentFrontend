// import { createBrowserRouter } from "react-router-dom";
// import Login from "./pages/auth/Login";
// import SignUp from "./pages/auth/SignUp";
// import DashboardLayout from "./components/DashboardLayout";
// import DashboardHome from "./pages/Dashboard/DashboardHome";
// import JobLayout from "./pages/job/JobLayout";
// import JobsList from "./pages/job/JobsList";
// import CreateJob from "./pages/job/CreateJob";
// import JobHome from "./pages/job/JobHome";

// export const Router = createBrowserRouter([
//     {
//         path: "/login",
//         element: <Login />
//     },
//     {
//         path: "/signup",
//         element: <SignUp />
//     },
//     {
//         path: "/dashboard",
//         element: <DashboardLayout />,
//         children: [
//             {
//                 index: true,
//                 element: <DashboardHome/>
//             },
//             {
//                 path: "job",
//                 element: <JobLayout/>,
//                 children: [
//                     {
//                         index: true,
//                         element: <JobHome/>
//                     },
//                     {
//                         path: "list",
//                         element: <JobsList/>
//                     },
//                     {
//                         path: "post",
//                         element: <CreateJob/>
//                     }
//                 ]
//             },
//         ],

//     }
// ])