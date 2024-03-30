import React from 'react';
import './Register.css'
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../services/userSlice';
import { BASE_URL } from '../../utils/BaseUrl';
const UserRegister = () => {

    const dispatch = useDispatch();
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        try {
            const response = await fetch(`${BASE_URL}/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Registration failed with status: ${response.status}`);
            }

            const data = await response.json();
            dispatch(loginSuccess(data));
            console.log('Registration successful:', data);

        } catch (error) {
            console.error('Registration error:', error);

           
        }
    };

    return (
        <div className="register-body">
            <div className="user-register">
                <h1> SignUp</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                            minLength={8} // Optional: Set minimum password length
                        />
                    </div>
                    <button type="submit" className='btn'>Register</button>
                    <div className="">Have an account? <a href="/" className="forgot-password">Login</a></div>
                    <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                </form>
            </div>
        </div>
    );
};

export default UserRegister;
