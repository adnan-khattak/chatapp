import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
// Optionally, add other services you plan to use

const firebaseConfig = {
  apiKey: "AIzaSyDCqPCgVOgfCohB_3XnATv9YU25ImM2iRA",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "chatapp-a1da7",
  storageBucket: "chatapp-a1da7.firebasestorage.app",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:835639542504:android:07cf83cf16711047db7f5d",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const firestore = firebase.firestore(); 
export const auth = firebase.auth();
export default firebase;
