import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./screens/Navbar";
import LoginForm from "./screens/LoginScreen";
import RegisterForm from "./screens/RegisterScreens";
import Dashboard from "./screens/Dashboards";
import FriendsScreens from "./screens/FriendsScreen";
import Test from "./screens/test";
import { ToastContainer } from "react-toastify";
// --- Pages futures (tu pourras les créer ensuite) ---
// import ProfilePage from "./screens/ProfilScreens";
// import EditProfilePage from "./screens/EditProfileScreen";
// import SettingsPage from "./screens/SettingsScreen";
// import SearchPage from "./screens/SearchScreen";
// import FriendRequestsPage from "./screens/FriendRequestsScreen";
// import TutorsPage from "./screens/TutorsScreen";
// import TutorProfilePage from "./screens/TutorProfileScreen";
// import AboutPage from "./screens/AboutScreen";
// import ContactPage from "./screens/ContactScreen";
// import PrivacyPage from "./screens/PrivacyScreen";
// import AdminDashboard from "./screens/AdminDashboard";
// import NotFound from "./screens/NotFound";
import UsersListScreen from "./screens/ListUsers";
import ChatBox from "./screens/Message/Chatbox";
import SignalerScreen from "./screens/Signaler";
function App() {
  return (
    <Router>
      <MyNavbar /> {/* Navbar visible sur toutes les pages */}
      <ToastContainer position="top-right" autoClose={3000}  />
      <Routes>
        {/* --- Pages publiques --- */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} /> */}
        <Route path="/search/users" element={<UsersListScreen />} />
        {/* --- Espace utilisateur --- */}
        {/* <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} /> */}

        {/* --- Pages sociales --- */}
        <Route path="/friends/user" element={<FriendsScreens />} />
        {/* <Route path="/friends/requests" element={<FriendRequestsPage />} />
        <Route path="/search" element={<SearchPage />} /> */}

        {/* --- Messagerie --- */}
         <Route path="/messages" element={<ChatBox />} /> 
        {/* --- Tutorat / Campus --- */}
        {/* <Route path="/tutors" element={<TutorsPage />} /> */}
        {/* <Route path="/tutor/:id" element={<TutorProfilePage />} /> */}
        {/* --- Signalement --- */}
        <Route path="/signaler" element={<SignalerScreen />} />

        {/* --- Admin (optionnel) --- */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}

        {/* --- Page 404 --- */}
        {/* <Route path="*" element={<NotFound />} /> */}

        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
