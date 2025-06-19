import { Routes, Route } from "react-router-dom"
import Home from "./pages/shared/Home.jsx"
import Login from "./pages/shared/Login.jsx"
import Layout from "./components/Layout.jsx"
import CoachDashboard from "./pages/coach/Dashboard.jsx"
import Workout from "./pages/coach/Workout.jsx"
import NewWorkout from "./pages/coach/WorkoutNew.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import EditWorkout from "./pages/coach/WorkoutEdit.jsx"
import ExerciseLibrary from "./pages/coach/ExerciseLibrary.jsx"
import ExerciseNew from "./pages/coach/ExerciseNew.jsx"
import ExerciseEdit from "./pages/coach/ExerciseEdit.jsx"
import CustomerPage from "./pages/coach/Customer.jsx"
import ViewWorkout from "./pages/coach/WorkoutView.jsx"
import MessageView from "./pages/coach/MessageView.jsx"
import MessageThread from "./pages/shared/MessageThread.jsx"
import MemberDashboard from "./pages/customer/MemberDashboard.jsx"
import MemberWorkouts from "./pages/customer/Workouts.jsx"
import NewMessage from "./pages/coach/NewMessage.jsx"
import UserProvider from "./contexts/UserProvider.jsx"
import ChangePassword from "./pages/customer/ChangePassword.jsx"
import ProtectedChangePassword from "./components/ProtectedChangePassword.jsx"
import MemberMessageView from "./pages/customer/MessageView.jsx"
import MemberProfile from "./pages/customer/Profile.jsx"
import CoachProfile from "./pages/coach/Profile.jsx"

// NUOVO SISTEMA TEMPLATE + CALENDARIO - IMPORT MANCANTI
import WorkoutCalendar from "./pages/coach/WorkoutCalendar.jsx"
import TemplateAssign from "./pages/coach/TemplateAssign.jsx"
import WorkoutTemplates from "./pages/coach/WorkoutTemplates.jsx"
import TemplateNew from "./pages/coach/TemplateNew.jsx"
import MemberCalendar from "./pages/customer/MemberCalendar.jsx"
import CoachRegister from "./pages/coach/CoachRegister.jsx"
import TemplateEdit from "./pages/coach/TemplateEdit.jsx"

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<CoachRegister />} />


        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CoachDashboard />} />
          <Route path="workouts" element={<Workout />} />
          <Route path="workout/:id" element={<ViewWorkout />} />
          <Route path="workout/new" element={<NewWorkout />} />
          <Route path="workout/:id/edit" element={<EditWorkout />} />
          <Route path="exercises" element={<ExerciseLibrary />} />
          <Route path="exercises/new" element={<ExerciseNew />} />
          <Route path="exercises/:id/edit" element={<ExerciseEdit />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="messages" element={<MessageView />} />
          <Route path="messages/new" element={<NewMessage />} />
          <Route path="profile" element={<CoachProfile />} />
          <Route path="messages/:id" element={<MessageThread />} />

          {/* NUOVO SISTEMA TEMPLATE + CALENDARIO */}
          <Route path="templates" element={<WorkoutTemplates />} />
          <Route path="templates/new" element={<TemplateNew />} />
          <Route path="templates/edit/:id" element={<TemplateEdit />} />
          <Route path="templates/:templateId/assign" element={<TemplateAssign />} />
          <Route path="templates/duplicate/:id" element={<TemplateEdit isDuplicate />} />

          <Route path="calendar" element={<WorkoutCalendar />} />
        </Route>

        <Route
          path="/change-password"
          element={
            <ProtectedChangePassword>
              <ChangePassword />
            </ProtectedChangePassword>
          }
        />

        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRoles={["cliente"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MemberDashboard />} />
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="workouts" element={<MemberWorkouts />} />
          <Route path="messages" element={<MemberMessageView />} />
          <Route path="messages/:id" element={<MessageThread />} />
          <Route path="calendar" element={<MemberCalendar />} />
        </Route>

        {/* Fallback */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </UserProvider>
  )
}
