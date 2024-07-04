import React from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { removeUser } from '../store/authSlice';

export default function Navbar() {
    const [user] = useAuthState(auth);
    console.log(user);
    const dispatch = useDispatch();

    const logoutUser = async () => {
        await signOut(auth);
        dispatch(removeUser());
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <span className="navbar-brand" to="/">WaterTracker</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        
                        {user ? (<>
                            <li className="nav-item">
                            <NavLink to="/dashboard/home" className={'nav-link ' + (({ isActive }) => (isActive ? 'active' : ''))}>Home</NavLink>
                        </li>
                            <li className="nav-item">
                                <NavLink to="/dashboard/addIntake" className={'nav-link ' + (({ isActive }) => (isActive ? 'active' : ''))}>
                                    Add Intake
                                </NavLink>
                            </li>
                        </>
                        ) : (" ")}

                    </ul>
                    {user ? (<><span className='m-2 p-2'><span style={{fontStyle:"italic"}}>Hello,</span> {user?.displayName}</span>
                        <a href='/#' className="btn btn-outline-secondary" onClick={logoutUser}>Logout</a> </>) : (" ")}

                </div>
            </div>
        </nav>
    )
}
