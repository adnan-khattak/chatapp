import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { firestore } from '../firebaseConfig';

const Users = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => { const unsubscribe = firestore.collection('users').onSnapshot(querySnapshot => { if (querySnapshot) { const users = querySnapshot.docs.map(doc => doc.data()); setUsers(users); } else { console.error("Error fetching users: QuerySnapshot is null"); } }); return () => unsubscribe(); }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { user: item })}
          >
            <Text style={styles.user}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  user: {
    padding: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default Users;
