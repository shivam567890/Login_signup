import React from 'react';
import './Register.css'
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../services/userSlice';
import { BASE_URL } from '../../utils/BaseUrl';
const UserLogin = () => {

    const dispatch = useDispatch();

    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });
   
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        
        try {
            const fcm_token = localStorage.getItem('FCM_TOKEN');
            if (!fcm_token) {
                throw new Error('FCM token not found');
            }
            const response = await fetch(`${BASE_URL}/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${fcm_token}`
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Login failed with status: ${response.status}`);
            }

            const data = await response.json();
            dispatch(loginSuccess(data));
            // console.log('LoggedIn successful:', data);
            
        } catch (error) {
            console.error('LoggedIn error:', error);

        }
    };

    return (
        <div className="register-body">
            <div className="user-register">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8} 
                        />
                    </div>
                    <button type="submit" className='btn'>Login</button>
                    <div className="">Don't have an account? <a href="/register" className="forgot-password">Register</a></div>
                    <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;
