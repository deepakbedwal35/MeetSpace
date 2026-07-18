import { BrowserRouter as Router,Routes , Route , Navigate  } from "react-router-dom";

import {Toaster} from "react-hot-toast"
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import VideoMeet from "./pages/VideoMeet.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";

function App() {
 
  return (
    <> 
    <Toaster position="top-center"/>
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home/>} />
          <Route path="/meeting/:url" element={<VideoMeet />} />
          {/* Add more routes like /room/:id here later */}
       </Route> 
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      

    </Router>
      
    </>
  )
}

export default App;
