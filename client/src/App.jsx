import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin/Admin';
import Student from './components/Student/Student';
import Faculty from './components/Faculty/Faculty';
import AddStudents from './components/Admin/AddStudent';
import InfoFaculty from './components/Admin/InfoFaculty';
import AddFaculty from './components/Admin/AddFaculty';
import InfoStudent from './components/Admin/InfoStudent';
function App() {
  return (
    
        <Routes>
          <Route path="/" element={<Login />} />

          
            <Route path="/admin" element={<Admin />} />
            <Route path = "addStudents" element = {<AddStudents/>} />
            <Route path ="/Faculty" element = {<InfoFaculty/>} />
            <Route path = "addFaculty" element= {<AddFaculty/>} />
            <Route path = "/Student" element = {<InfoStudent/>} />
            <Route path="/student" element={<Student />} />
         

          
            <Route path="/faculty" element={<Faculty />} />
            
            

        </Routes>
    
  );
}

export default App;
