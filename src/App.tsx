import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./screens/Navbar";
import LoginForm from "./screens/LoginScreen";
// import ProfilePage from "./screens/ProfilScreens";
import RegisterForm from "./screens/RegisterScreens"
import Dashboard from "./screens/Dashboards";
import FriendsScreens from "./screens/FriendsScreen";
function App() {
  return (
    <Router>
      <MyNavbar /> {/* Navbar visible sur toutes les pages */}
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/friend/user/:userid" element={<FriendsScreens/>}/>
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        {/* Ajoute d'autres pages ici */}
      </Routes>
    </Router>
  );
}

export default App;
