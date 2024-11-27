import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import Chat from '../screens/Chat';
import Users from '../screens/Users';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name='Signup' component={Signup} options={{ title: 'SignUP' }} />
        <Stack.Screen name='Home' component={Home} options={{title: 'Welcome to Home'}}/>
        <Stack.Screen name='Chat' component={Chat} options={{title:'Chat screen'}} />
        <Stack.Screen name='Users' component={Users} options={{title:'User List'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
