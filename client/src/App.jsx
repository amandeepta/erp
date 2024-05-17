import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider'
import Login from './components/Login';
import Admin from './components/Admin/Admin';
import Student from './components/Student/Student';
import Faculty from './components/Faculty/Faculty';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            <Route path="/student" element={<Student />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
            <Route path="/faculty" element={<Faculty />} />
          </Route>

        </Routes>
    </AuthProvider>
  );
}

export default App;
