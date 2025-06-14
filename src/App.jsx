import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from './pages/Layout';
import Home from './pages/Home';
import VisionBoard from './pages/VisionBoard';
import Goals from './pages/Goals';
import Inspiration from './pages/Inspiration';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  function logout() {
    auth.signOut();
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout user={user} logout={logout} auth={auth} />}>
          <Route index element={<Home user={user} />} />
          <Route path="vision-board" element={<VisionBoard user={user} />} />
          <Route path="goals" element={<Goals user={user} />} />
          <Route path="inspiration" element={<Inspiration user={user} />} />
          <Route path="profile" element={<Profile user={user} setUser={setUser} />} />
        </Route>
        <Route path="/login" element={<Login auth={auth} setUser={setUser} />} />
        <Route path="/signup" element={<SignUp auth={auth} setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;