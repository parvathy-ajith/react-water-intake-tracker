import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function Access() {
  const [isLogin, setIsLogin] = useState(true);

  const setAceess=(toggle)=>{
    setIsLogin(toggle);
  }

  return (


    <div className='container my-2' >
      <div className='row g-0 align-items-center'>
        <div className='col-md-6 py-5' style={{ backgroundColor:"rgba(213,239,238,255)" }}>
        <div className="h5 fw-bold mt-5 ">This is your reminder to</div>
        <div className="h1 fw-bold ">TO DRINK</div>
        <div className="h1 fw-bold mb-5 ">WATER</div>
        <div className="h1 fw-bold mb-5 ">Track your water intake. </div>
        </div>
        <div className='col-md-6 pt-5'>
          <div className='mt-5'>
            <i className="fa fa-coffee fa-3x me-3" style={{ color: '#709085' }}></i>
            <span className="h1 fw-bold ">WaterTracker</span>
          </div>
          {isLogin ? (<Login setAceess={setAceess} />) : (<Register setAceess={setAceess}  />)}
        </div>
      </div>
    </div>
  )
}
