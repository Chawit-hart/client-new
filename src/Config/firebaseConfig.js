import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig =
{
  apiKey: "AIzaSyAF5kVo8zqEK4NMZHHl8OZmGa0lAHhtvlc",
  authDomain: "ads-hop.firebaseapp.com",
  databaseURL: "https://ads-hop-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ads-hop",
  storageBucket: "ads-hop.appspot.com",
  messagingSenderId: "1031249854170",
  appId: "1:1031249854170:web:2ccbbc2be5261139d36fe3",
  measurementId: "G-BXGX0KLCSD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
