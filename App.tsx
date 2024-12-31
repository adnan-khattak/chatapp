// src/components/App.tsx  
import React, { useEffect } from 'react';  
import AppNavigator from './navigation/AppNavigator';
import Splash from './screens/Splash'; 
const App: React.FC = () => {  
  return (  
    <AppNavigator />  
    // <Splash />  
  );  
};  

export default App;