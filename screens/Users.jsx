import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { firestore, auth} from '../firebaseConfig';

const Users = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState(null);

  // Fetch current user UID
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // console.log("Current User UID:", user.uid);
      setCurrentUserUid(user.uid);
    }
  }, []);

  // Fetch users after currentUserUid is set
  useEffect(() => {
    if (currentUserUid) {
      const unsubscribe = firestore.collection('users').onSnapshot(querySnapshot => {
        if (querySnapshot) {
          const fetchedUsers = querySnapshot.docs.map(doc => doc.data());
          // console.log("Fetched Users:", fetchedUsers);
          const filteredUsers = fetchedUsers.filter(user => user.uid !== currentUserUid);
          // console.log("Filtered Users:", filteredUsers);
          setUsers(filteredUsers);
        } else {
          console.error("Error fetching users: QuerySnapshot is null");
        }
      });

      return () => unsubscribe();
    }
  }, [currentUserUid]);

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <Text style={styles.noUsersText}>No users found</Text>
      ) : (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  user: {
    color: '#000',
    padding: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  noUsersText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default Users;
