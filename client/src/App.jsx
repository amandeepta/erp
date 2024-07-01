import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin/Admin';
import Student from './components/Student/Student';
import Faculty from './components/Faculty/Faculty';
import AddStudents from './components/Admin/AddStudent';
import InfoFaculty from './components/Admin/InfoFaculty';
import AddFaculty from './components/Admin/AddFaculty';
import InfoStudent from './components/Admin/InfoStudent';
import Attendance from './components/Faculty/Attendance';
import GetAttendance from './components/Student/GetAttendace';
function App() {
  return (
    
        <Routes>
          <Route path="/" element={<Login />} />

          
            <Route path="/admin" element={<Admin />} />
            <Route path = "addStudents" element = {<AddStudents/>} />
            <Route path ="/infoFaculty" element = {<InfoFaculty/>} />
            <Route path = "addFaculty" element= {<AddFaculty/>} />
            <Route path = "/infoStudent" element = {<InfoStudent/>} />
            

            <Route path="/student" element={<Student />} />
            <Route path = "/getAttendance" element = {<GetAttendance/>} />

          
            <Route path="/faculty" element={<Faculty />} />
            <Route path = '/attendance' element = {<Attendance/>} />

        </Routes>
    
  );
}

export default App;
