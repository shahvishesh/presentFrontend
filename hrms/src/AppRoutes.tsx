import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import JobLayout from "./pages/job/JobLayout";
import JobHome from "./pages/job/JobHome";
import JobsList from "./pages/job/JobsList";
import JobDetails from "./pages/job/JobDetails";
import TravelLayout from "./pages/travel-plan/TravelLayout";
import TravelHome from "./pages/travel-plan/TravelHome";
import ExpenseLayout from "./pages/expense/ExpenseLayout";
import CreateTravel from "./pages/travel-plan/CreateTravel";
import TravelPlanDetails from "./pages/travel-plan/TravelPlanDetails";
import UploadDocument from "./pages/document/UploadDocument";
import EmployeeList from "./pages/chart/EmployeeList";
import EmployeeChartPage from "./pages/chart/EmployeeChartPage";
import ChartLayout from "./pages/chart/ChartLayout";
import EmployeeTravelLayout from "./pages/employee-travel-plan/EmployeeTravelLayout";
import EmployeeTravelHome from "./pages/employee-travel-plan/EmployeeTravelHome";
import Expense from "./pages/employee-travel-plan/Expense";
import Document from "./pages/employee-travel-plan/Document";
import ExpenseHome from "./pages/expense/ExpenseHome";
import ExpenseTravelPlanDetails from "./pages/expense/ExpenseTravelPlanDetails";
import VerifyExpense from "./pages/expense/VerifyExpense";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import AddEmployee from "./pages/auth/AddEmployee";
import UploadCommonTravelDocument from "./pages/travel-plan/UploadCommonTravelDocument";
import SocialLayout from "./pages/social/SocialLayout";
import SocialHome from "./pages/social/SocialHome";
import AddPost from "./pages/social/AddPost";
import ViewAllPost from "./pages/social/ViewAllPost";
import PostDetail from "./pages/social/PostDetail";
import EditPost from "./pages/social/EditPost";
import UserPostList from "./pages/social/UserPostList";
import DeleteJob from "./pages/job/DeleteJob";
import ReferralJobsList from "./pages/job/ReferralJobList";
import JobReferral from "./pages/job/JobReferral";
import GameLayout from "./pages/game/GameLayout";
import GameHome from "./pages/game/GameHome";
import SelectGame from "./pages/game/SelectGame";
import SlotList from "./pages/game/SlotList";
import BookSlot from "./pages/game/BookSlot";
import GameInterest from "./pages/game/GameInterest";
import CreateConfiguration from "./pages/game/CreateConfiguration";
import RegisteredSlot from "./pages/game/RegisteredSlot";
import ChooseGame from "./pages/game/ChooseGame";
import CompletedBooking from "./pages/game/CompletedBooking";
import UpcomingBooking from "./pages/game/UpcomingBooking";
import CancelledBooking from "./pages/game/CancelledBooking";
import AllGameConfiguration from "./pages/game/AllGameConfiguration";
import UpdateConfiguration from "./pages/game/UpdateConfiguration";
import NotificationList from "./pages/notification/NotificationList";
import NotificationDetail from "./pages/notification/NotificationDetail";
import NotificationLayout from "./pages/notification/NotificationLayout";
import CreateJobWithReviewer from "./pages/job/CreateJobWithReviewer";
import TravelPlans from "./pages/employee-travel-plan/travel-plan-list/TravelPlans";
import EmployeeTravelPlanDetail from "./pages/employee-travel-plan/travel-plan-list/EmployeeTravelPlanDetail";
import RoleLayout from "./pages/role/RoleLayout";
import RoleHome from "./pages/role/RoleHome";
import RoleUserList from "./pages/role/RoleUserList";
import ManagerLayout from "./pages/manager/ManagerLayout";
import ManagerHome from "./pages/manager/ManagerHome";
import ManagerTeamList from "./pages/manager/ManagerTeamList";
import ManagerEmployeeDetail from "./pages/manager/ManagerEmployeeDetail";
import ManagerEmployeeTravelDetail from "./pages/manager/ManagerEmployeeTravelDetail";
import UpdateTravelPlan from "./pages/travel-plan/UpdateTravelPlan";
import UpdateJob from "./pages/job/UpdateJob";
import ExpenseRecords from "./pages/expense/expense-tabs/ExpenseRecords";
import UpdateExpense from "./pages/expense/UpdateExpense";
import EmployeeProfile from "./pages/profile/EmployeeProfile";
import EmployeeLayout from "./pages/profile/EmployeeLayout";
import EmployeeProfileList from "./pages/profile/EmployeeProfileList";
import UpdateProfile from "./pages/profile/UpdateProfile";
import type { TravelPlanResponse } from "./api/travel.api";
import HRTravelPlans from "./pages/travel-plan/travel-tabs/HRTravelPlans";
import HRExpenseTravelPlans from "./pages/expense/travel-plan-list/HRExpenseTravelPlans";
import AdminSignUp from "./pages/auth/AdminSignup";
import NotFoundPage from "./pages/NotFoundPage";

export default function AppRoutes(){
    const navigate = useNavigate();
    return(
       <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
        
            <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<EmployeeProfile />}/>

            <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
                <Route path="user" element={<RoleLayout />}>
                    <Route index element={<RoleHome />}/>
                    <Route path="all" element={<RoleUserList />}/>
                    <Route path="signup" element={<AdminSignUp />} />
                    
                </Route>
            </Route>

             <Route element={<ProtectedRoute allowedRoles={["ROLE_MANAGER"]} />}>
                <Route path="team" element={<ManagerLayout />}>
                    <Route index element={<ManagerHome />}/>
                    <Route path="all" element={<ManagerTeamList />}/>
                    <Route path=":employeeId" element={<ManagerEmployeeDetail/>}/>
                    <Route path=":employeeId/:travelPlanId" element={<ManagerEmployeeTravelDetail/>}/>
                    
                </Route>

            </Route>
            
        
            <Route element={<ProtectedRoute allowedRoles={["ROLE_HR"]} />}>
                <Route path="travel" element={<TravelLayout />}>
                    <Route index element={<TravelHome />} />
        
        
                    <Route path="list" element={<HRTravelPlans />} />
                    <Route path="create" element={<CreateTravel />} />
                    <Route path="update/:travelPlanId" element={<UpdateTravelPlan/>}/>
                    <Route path=":travelPlanId" element={<TravelPlanDetails />} />
                    <Route
                        path=":travelPlanId/:employeeId/assign-document"
                        element={<UploadDocument />}
                    />
                    <Route
                        path=":travelPlanId/assign-common-document"
                        element={<UploadCommonTravelDocument />}
                    />
                </Route>

                <Route path="employee" element={<EmployeeLayout />}>
                    <Route index element={<EmployeeProfileList />}/>
                    <Route path=":employeeId" element={<UpdateProfile />}/>
                    <Route path="add" element={<AddEmployee/>}/>
                    
                </Route>
        
                {/* <Route path="job" element={<JobLayout />}>
                <Route index element={<JobHome />} />
                <Route path="list" element={<JobsList />} />
                <Route path="create" element={<CreateJob />} />
                <Route path=":jobId" element={<JobDetails />} />
                </Route> */}
        
                <Route path="expense" element={<ExpenseLayout />}>
                    <Route index element={<ExpenseHome />} />
                    <Route path="travel" element={<HRExpenseTravelPlans
                        onClick={(travel: TravelPlanResponse) => {
                            navigate(`/dashboard/expense/travel/${travel.travelPlanId}`);
                        }}
                        actionLabel="View Details"
                        pageTitle="Travels"
                    />}/>
                    {/* <Route path="travel" element={<ExpenseTravelPlanList />} /> */}
                    <Route
                        path="travel/:travelPlanId"
                        element={<ExpenseTravelPlanDetails />}
                    />
                    <Route
                        path="travel/:travelPlanId/:employeeId/expenses"
                        element={<ExpenseRecords />}
                    />
                    <Route
                        path="travel/:travelPlanId/:employeeId/:expenseId/expenses/verify"
                        element={<VerifyExpense />}
                    />
                    <Route
                        path="travel/:travelPlanId/:employeeId/:expenseId/expenses/update"
                        element={<UpdateExpense />}
                    />
                </Route>
            </Route>
        
            <Route element={<ProtectedRoute allowedRoles={["ROLE_HR", "ROLE_EMPLOYEE"]} />}>
                <Route path="chart" element={<ChartLayout />}>
                    <Route index element={<EmployeeList />} />
                    <Route path=":id" element={<EmployeeChartPage />} />
                </Route>

                <Route path="job" element={<JobLayout />}>
                    <Route index element={<JobHome />} />
                    <Route path="list" element={<JobsList />} />
                    <Route path="create" element={<CreateJobWithReviewer />} />
                    <Route path="update/:jobId" element={<UpdateJob/>}/>
                    <Route path=":jobId" element={<JobDetails />} />
                    <Route path="close" element={<DeleteJob />} />
                    <Route path="referral/list" element={<ReferralJobsList />} />
                    <Route path="referral/:jobId" element={<JobReferral />} />
                </Route>

                <Route path="notification" element={<NotificationLayout/>}>
                    <Route index element={<NotificationList/>}/>

                    <Route path=":notificationId" element={<NotificationDetail/>}/>
                </Route>
            </Route>
        
            <Route element={<ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]} />}>
                <Route path="Etravel" element={<EmployeeTravelLayout />}>
                    <Route index element={<EmployeeTravelHome />} />
                    <Route path="travels" element={<TravelPlans
                        onClick={(travel: TravelPlanResponse) => {
                            navigate(`/dashboard/Etravel/${travel.travelPlanId}`);
                        }}
                        actionLabel="View Details"
                        pageTitle="Travels"
                    />}/>
                    <Route path=":travelPlanId" element={<EmployeeTravelPlanDetail/>}/>
                    <Route path="Elist" element={<TravelPlans
                        onClick={(travel: TravelPlanResponse) => {
                            navigate(`/dashboard/Etravel/expense/${travel.travelPlanId}`);
                        }}
                        hideDraftTab
                        actionLabel="Submit Expense"
                        pageTitle="Submit Expense"
                    />}/>
                    {/* <Route path="Elist" element={<EEmployeeTravelPlanList />} /> */}
                    <Route path="expense/:travelPlanId" element={<Expense />} />
                    <Route path="Dlist" element={<TravelPlans
                        onClick={(travel: TravelPlanResponse) => {
                            navigate(`/dashboard/Etravel/document/${travel.travelPlanId}`);
                        }}
                        actionLabel="Submit Document"
                        pageTitle="Submit Document"
                    />}/>
                    {/* <Route path="Dlist" element={<DEmployeeTravelPlanList />} /> */}
                    <Route path="document/:travelPlanId" element={<Document />} />
                </Route>
            </Route>

            <Route path="social" element={<SocialLayout/>}>
                    <Route index element={<SocialHome/>}/>
                    <Route path="create" element={<AddPost/>}/>
                    <Route path="all" element={<ViewAllPost/>}/>
                    <Route path="post/:postid" element={<PostDetail/>}/>
                    <Route path="edit/:id" element={<EditPost/>}/>
                    <Route path="post/my" element={<UserPostList/>}/>
            </Route>

            <Route path="game" element={<GameLayout/>}>
                    <Route index element={<GameHome/>}/>
                    <Route path="choose" element={<SelectGame/>}/>
                    <Route path=":gameId/slot" element={<SlotList/>}/>
                    <Route path="slot/:slotId" element={<BookSlot/>}/>
                    <Route path="interest" element={<GameInterest/>}/>
                    <Route path="configure/create" element={<CreateConfiguration/>}/>
                    <Route path="configure/update" element={<AllGameConfiguration/>}/>
                    <Route path="configure/update/:configId" element={<UpdateConfiguration/>}/>

                    <Route path="choose/game" element={<ChooseGame/>}/>
                    <Route path=":gameId/registrations" element={<RegisteredSlot/>}/>
                    <Route path="slot/booking/cancelled" element={<CancelledBooking/>}/>
                    <Route path="slot/booking/completed" element={<CompletedBooking/>}/>
                    <Route path="slot/booking/upcoming" element={<UpcomingBooking/>}/>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        
            </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}