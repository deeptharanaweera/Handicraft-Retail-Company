import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Page/Login';
import Register from './Page/Register';
import Home from './Page/Home';
import AdminDashboard from './Page/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/admindashboard' element={<AdminDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
