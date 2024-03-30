// http://localhost:3000/v1/auth/forgot-password

import React, { useState } from 'react';
import { BASE_URL } from '../../utils/BaseUrl';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
   

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        try {
            const response = await fetch(`${BASE_URL}/v1/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({email: email}),
            });

            if (!response.ok) {
                throw new Error(`Password reset failed with status: ${response.status}`);
            }

            // const data = await response.json();
            // console.log('Link send successfully:', data);
            alert("Password reset link has been sent to your registered email.")
         
        } catch (error) {
            console.error('Reset password error:', error);

            
        }

        setEmail(''); // Clear email input after submission (optional)
    };

    return (
        <div className="register-body">
            <div className="user-register">
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn">
                      Reset Password
                </button>
            </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
