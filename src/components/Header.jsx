import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';

import userProfile from '../image/userProfile.jpg'
import { logout } from '../services/userSlice';


// import './Header.css'; // 

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userInfo = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDropdownToggle = () => {
     
      setIsDropdownOpen(!isDropdownOpen);
  };


  const handleCartClick = () => {
    navigate('/userCart');
  }
  // console.log(userInfo)
  const handleLogout = () => {
    // log out logic goes here
    dispatch(logout());
    navigate('/');
    window.location.reload();
    console.log('Logout clicked!');
  };

  return (
    <div className="header">
      <div className="header__left">
        <Link className='link' to="/">Dashboard</Link>
      </div>
      <div className="header__right">
        <FaUserCircle className="user-icon" onClick={handleDropdownToggle} />
        {isDropdownOpen && (
          <div className="dropdown">
            <div className="dropdown-content">
              {userInfo && (
                <>
                  <img src={userInfo?.user?.profilePic || userProfile} alt="Profile Picture" className="profile-pic" />
                  <p>{userInfo.user.name}</p>
                  <p>{userInfo.user.email}</p>
                  <div className="btn" style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                  <button className="dropdown-button" onClick={handleLogout}>
                    Logout
                  </button>
                  <button className="dropdown-button" onClick={()=>navigate('/userOrder')}>
                    Go to your orders
                  </button>
                  </div>
                </>
              )}
              
            </div>
          </div>
        )}
         <FaShoppingCart className="cart-icon" onClick={handleCartClick} />
       
      </div>
    </div>
  );
};

export default Header;
