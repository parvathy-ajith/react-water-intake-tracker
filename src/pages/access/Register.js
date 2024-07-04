import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';

export default function Register(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerSchema = yup.object().shape({
    name: yup.string().required("Pleae enter your name."),
    email: yup.string().email("Enter valid Email Address").required("MUST enter your Email Address."),
    password: yup.string().min(6, "Minimum 6 characters required for password.").max(15, "Minimum 4 characters required for password.").required("MUST enter your Password."),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords did not match!!!!!").required("Confirm the password.")
  });
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(registerSchema) });

  const setLogin = () => {
    props.setAceess(true);
  }

  const registerUser = async (data) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch(setUser(user));
        navigate("/dashboard/home");
        console.log('Profile created');
      }).then(() => {
        updateProfile(auth.currentUser, { displayName: data.name })
          .then(() => {
            auth.currentUser.reload().then(()=>{
              console.log('Profile updated');
          })         
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }
  return (
    <div className='p-3'>
      <h5 className="fw-normal my-4 " style={{ letterSpacing: '1px' }}>Create a new account</h5>
      <form className="form-login p-4" onSubmit={handleSubmit(registerUser)}>
        <input type='text' className='form-control' placeholder='Full Name.... ' {...register("name")} />
        <p className='text-danger'>{errors ? errors.name?.message : " "}</p>
        <input type='email' className='form-control' placeholder='Email Address.... ' {...register("email")} />
        <p className='text-danger'>{errors ? errors.email?.message : " "}</p>
        <input type='password' className='form-control' placeholder='Password.... ' {...register("password")} />
        <p className='text-danger'>{errors && errors.password?.message}</p>
        <input type='password' className='form-control' placeholder='Confirm Password.... ' {...register("confirmPassword")} />
        <p className='text-danger'>{errors && errors.confirmPassword?.message}</p>
        {/* Submit is NOT a button but input else
                        it won't work with react-hook-form*/}
        <div className="d-grid gap-2">
          <input className='btn btn-secondary' type='submit' value="Register & Login" />
        </div>
        <span style={{ color: '#709085' }}>Already have an account?<button className="btn  btn-link" type="button" onClick={setLogin}>Login Here!</button></span>
      </form>
    </div>
  )
}
