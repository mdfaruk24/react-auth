import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    // Clear cookies and navigate to login page
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  return (
    <div className='container mt-4'>
      {
        auth ?
          <div>
            <h3>You are Authorized - {name}</h3>
            <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
          </div>
          :
          <div>
            <h3>{message}</h3>
            <h3>Login Now</h3>
            <Link to="/login" className='btn btn-primary'>Login</Link>
          </div>
      }
    </div>
  );
}

export default Home;
