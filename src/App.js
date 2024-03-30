import './App.css';
import { useEffect } from 'react';
import Header from './components/Header';
import UserLogin from './components/userAuth/UserLogin';
import UserRegister from './components/userAuth/UserRegister';
import { Routes, Route } from 'react-router-dom'
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from './firebase/firebaseConfig';
import { useSelector } from 'react-redux';
import UserDashboard from './components/UserDashboard';
import ForgotPassword from './components/userAuth/ForgotPassword';
import ResetPassword from './components/userAuth/ResetPassword';
import UserCart from './components/UserCart';
import { BASE_URL } from './utils/BaseUrl';
import UserOrder from './components/UserOrder';
function App() {

  const key = "BLjE6iECAGTKtGDckiUVy8Mh5arKm90_Lpo20AmAYgzPXosVLwT4FtT5wYDFXpVyMK2e1G8rR1ju5_Hq2AXE0FU";
  // console.log("Base url: " + BASE_URL);
  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Permission granted');
        getToken(messaging, { vapidKey: key }).then(currentToken => {
          if (currentToken) {
            // send the token to the server
            console.log('Token: ' + currentToken);

            localStorage.setItem('FCM_TOKEN', currentToken);
          } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }).catch(err => {
      console.error("Permission is not granted ", err);
    });

    // eslint-disable-next-line
  }, []);
  const user = useSelector((state) => state.user.userData);
  var token = null;
  if (user) {
     token = user.tokens.refresh.token;
    
  }
  const createUserCart = async () => {
    try {
      const response = await fetch(`${BASE_URL}/v1/userCart/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
          },
        }
      );
      if (!response.ok) {
        throw new Error('user cart creation failed with status code ' + response.status);
      }
      const json = await response.json();
      console.log(json);

      
    } catch (error) {
        console.error("Error creating user", error);
    }
  }

  useEffect(() => {
    createUserCart();
    console.log(user);
  }, []);

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <div className="App">
      {isLoggedIn && <Header />}
      <Routes>
        {
          !isLoggedIn ? (<>
            <Route path='/' element={<UserLogin />} />
            <Route path='/register' element={<UserRegister />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
          </>) : (
            <>
                <Route path='/' element={<UserDashboard />} />
                <Route path='/userCart' element={<UserCart />} />
                <Route path='/userOrder' element={<UserOrder/>}/>
            </>
          )
        }

      </Routes>

    </div>
  );
}

export default App;
