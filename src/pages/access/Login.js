import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import {auth} from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';

export default function Login(props) {
    const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loginSchema = yup.object().shape({
        email: yup.string().email("Enter valid Email Address").required("MUST enter your Email Address"),
        password: yup.string().min(6, "Minimum 6 characters required for password").max(15, "Minimum 4 characters required for password").required("MUST enter your Password")
    });

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) });

    const setRegister=()=>{
        props.setAceess(false);
    }

    const loginUser =(data) =>{
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            dispatch(setUser(user));
            navigate("/dashboard/home")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoginError(errorMessage);
            console.log(errorCode, errorMessage);
        });
    }
    return (
        <div className='p-3'>
            <h5 className="fw-normal my-4 " style={{ letterSpacing: '1px' }}>Sign into your account</h5>
            {loginError !== null || undefined ? (<h6 className="fw-normal" style={{ color:"red", letterSpacing: '1px' }}>Wrong username or password.</h6>): null}
            <form className="form-login p-4" onSubmit={handleSubmit(loginUser)}>
                <input type='email' className='form-control' placeholder='Email Address.... ' {...register("email")} />
                <p className='text-danger'>{errors ? errors.email?.message : " "}</p>
                <input type='password' className='form-control' placeholder='Password.... ' {...register("password")} />
                <p className='text-danger'>{errors && errors.password?.message}</p>
                {/* Submit is NOT a button but input else
                        it won't work with react-hook-form*/}
                <div className="d-grid gap-2">
                    <input className='btn btn-secondary' type='submit' value="LOGIN" />
                </div>
                <button style={{ color: '#709085' }} className="btn  btn-link" type="button" onClick={setRegister}>Register</button>
            </form>
        </div>
    )
}
