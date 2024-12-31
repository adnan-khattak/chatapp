import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
// import {PermissionsAndroid} from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';  

const Home = () => {
    const navigation = useNavigation();
   

    async function requestUserPermission() {  
      try {  
        // Check the Android platform version  
        if (Platform.OS === 'android' && Platform.Version >= 33) {  
          // Manually request the notification permission for Android API level 33+  
          const granted = await PermissionsAndroid.request(  
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS  
          );  
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {  
            console.log('User denied push notification permission');  
            return;  
          }  
        }  
    
        // Request the permission using the Firebase Messaging API  
        const authStatus = await messaging().requestPermission();  
        const enabled =  
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||  
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;  
    
        if (enabled) {  
          console.log('Authorization status:', authStatus);  
        } else {  
          console.log('User has rejected push notification permissions');  
        }  
      } catch (error) {  
        console.error('Error requesting push notification permissions:', error);  
      }  
    }  
const getToken = async () => {  
  try {  
    const token = await messaging().getToken();  
    console.log('FCM Token:', token);  
    // Save the token for later use (e.g., to send push notifications)  
    await storeDeviceToken(token);  
  } catch (error) {  
    console.error('Error getting FCM token:', error);  
  }  
};  

function storeDeviceToken(token) {  
  // Save the token to your app's state or a database  
  console.log('Stored device token:', token);  
}  

function handleNotification(notification) {  
  // Handle the incoming notification in your app  
  console.log('Handling notification:', notification);  
}  
useEffect(()=>{
  requestUserPermission()
  getToken()
},[])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome Home!</Text>
      <Button title="Go to Chat" onPress={() => navigation.navigate('Users')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
  },
});

export default Home;
