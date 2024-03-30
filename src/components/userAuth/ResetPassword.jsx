// http://localhost:3000/v1/auth/forgot-password

import React, { useState,useEffect } from 'react';
import queryString from 'query-string'
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/BaseUrl';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
   
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = queryString.parse(window.location.search);
        const resetToken = urlParams.token;
        // console.log(resetToken);
        if (resetToken) {
            setToken(resetToken);
        }
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (password !== newPassword) {
                alert("Check confirm password");
                throw new Error('Password is not matched');
            }
            console.log("token:",token)
            const response = await fetch(`${BASE_URL}/v1/auth/reset-password?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: password }),
            });

            if (!response.ok) {
                throw new Error(`Password reset failed with status: ${response.status}`);
            }
            alert("Password successfully reset");
            console.log('password changed successfully:', response);
            navigate('/');

        } catch (error) {
            console.error('Reset password error:', error);


        }

        setNewPassword('');
        setPassword('');
    };

    return (
        <div className="register-body">
            <div className="user-register">
                <h1>Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Confirm Password</label>
                        <input
                            type="password"
                            id="npassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <button type="submit" className="btn">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
