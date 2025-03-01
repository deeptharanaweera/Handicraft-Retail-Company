import axios from 'axios';
import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
function Register() {
  const [values, setValues] = useState({
    salutation: '',
    firstName: '',
    lastName: '',
    telephone: '',
    address: '',
    email: '',
    userName: '',
    password: '',
  })

  // const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }


  const handleSubmit = (event) =>{
    event.preventDefault();
    // if(errors.salutation === "" && errors.firstName === "" && errors.lastName === "" && errors.telephone === "" && errors.address === "" && errors.email === "" && errors.userName === "" && errors.password === ""){
      
    // }
    axios.post('http://localhost:5000/Register', values)
    .then(res => {
      toast.success('Registration Successfully');
      console.log(res);
      navigate('/');
    })
    .catch(err => console.log(err));
  }

  console.log(values);

  return (
    <div className=' flex flex-col items-center justify-center h-screen'>
      <Toaster/>
      <h1 className='text-4xl font-bold'>Register</h1>
      <form onSubmit={handleSubmit} className='mt-5 w-4/12'>
        <div className='flex flex-col justify-center'>
          <label className='text-xl font-semibold'>Salutation</label>
          <select name="salutation" onChange={handleInput} className='bg-gray-200 px-4 py-2 rounded-md'>
          <option value="">Select</option>
            <option value="mr">Mr.</option>
            <option value="mrs">Mrs.</option>
            <option value="ms">Ms.</option>
          </select>
        </div>
        <div className='flex flex-col justify-center'>
          <label htmlFor="" className='text-xl font-semibold'>First Name</label>
          <input type="text" id='firstName' name='firstName' className='bg-gray-200 px-4 py-2 rounded-md' onChange={handleInput} />
        </div>
        <div className='flex flex-col justify-center'>
          <label htmlFor="" className='text-xl font-semibold'>Last Name</label>
          <input type="text" id='lastName' name='lastName' className='bg-gray-200 px-4 py-2 rounded-md' onChange={handleInput} />
        </div>
        <div className='flex flex-col justify-center'>
          <label htmlFor="" className='text-xl font-semibold'>Telephone Number</label>
          <input type="text" id='telephone' name='telephone' className='bg-gray-200 px-4 py-2 rounded-md' onChange={handleInput} />
        </div>
        <div className='flex flex-col justify-center'>
          <label htmlFor="" className='text-xl font-semibold'>Address</label>
          <input type="text" id='address' name='address' className='bg-gray-200 px-4 py-2 rounded-md' onChange={handleInput} />
        </div>
        <div className='flex flex-col justify-center'>
          <label htmlFor="" className='text-xl font-semibold'>Email address</label>
          <input type="email" id='email' name='email' className='bg-gray-200 px-4 py-2 rounded-md' onChange={handleInput} />
        </div>
        <div className='flex flex-col justify-center'>
          <label htmlFor="" className='text-xl font-semibold'>UserName</label>
          <input type="text" id='userName' name='userName' className='bg-gray-200 px-4 py-2 rounded-md' onChange={handleInput} />
        </div>
        <div className='flex flex-col justify-center'>
          <label htmlFor="" className='text-xl font-semibold'>Password</label>
          <input type="text" id='password' name='password' className='bg-gray-200 px-4 py-2 rounded-md' onChange={handleInput} />
        </div>

        <button type='submit' className='bg-blue-500 text-white w-full my-2 rounded-md py-2' >Register</button>
        <p>Already have an account <Link to={'/'} className='text-blue-500 font-semibold'>Login here.</Link></p>
      </form>
    </div>
  )
}

export default Register