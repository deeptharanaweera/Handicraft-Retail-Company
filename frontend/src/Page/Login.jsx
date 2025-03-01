import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [values, setValues] = useState({
    userName: '',
    password: '',
  })

  const navigate = useNavigate();

  const handleInput = (event) =>{
    setValues(prev => ({...prev, [event.target.name] : event.target.value}))
  }

  console.log(values);

  const handleSubmit = (event) =>{
    event.preventDefault();

    if (values.userName === "Admin" && values.password === "12345678") {
      navigate('/admindashboard'); 
      return;
    }
  

    axios.post('http://localhost:5000/Login', values)
    .then((res)=> {
      console.log(res.data);
      if(res.data.Login){
        localStorage.setItem('user', JSON.stringify({
          id: res.data.user.id,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
        }));
        navigate('/home');
      }
      else{
        alert('No Record Found');
      }
    })
    .catch(err => console.log(err));
  }

  return (
    <div className=' flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold'>Login</h1>
      <form onSubmit={handleSubmit} className='mt-5'>
        <div className='flex flex-col justify-center'>
          <label htmlFor="" className='text-xl font-semibold'>User Name</label>
          <input type="text" name="userName" id="userName" onChange={handleInput} className='bg-gray-200 px-4 py-2 rounded-md'/>
        </div>
        <div className='flex flex-col justify-center'>
          <label htmlFor="" className='text-xl font-semibold'>Password</label>
          <input type="password" name="password" id="password" onChange={handleInput} className='bg-gray-200 px-4 py-2 rounded-md'/>
        </div>
        <button type='submit' className='bg-blue-500 text-white w-full my-2 rounded-md py-2' >Login</button>
        <p>If you don't have an account <Link to={'/register'} className='text-blue-500 font-semibold'>Register here.</Link></p>
      </form>
    </div>
  )
}

export default Login