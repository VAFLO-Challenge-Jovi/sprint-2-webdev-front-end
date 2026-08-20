import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Camera from './pages/Camera.jsx';
import History from './pages/History.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/history" element={<History />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer />
    </ToastProvider>
  );
}
