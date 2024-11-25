import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import * as ImagePicker from 'react-native-image-picker';
import * as DocumentPicker from 'react-native-document-picker';
import moment from 'moment';

const Chat = ({ route }) => {
  const { user } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [media, setMedia] = useState(null);

  useEffect(() => {
    console.log("Fetching messages for current user:", auth.currentUser.uid);
    const unsubscribe = firestore.collection('messages')
      .where('users', 'array-contains', auth.currentUser.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        if(querySnapshot){
        const messages = querySnapshot.docs.map(doc => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt.toDate(),
          user: doc.data().user || null,
          media: doc.data().media || null,
        }));
        setMessages(messages);
      } else{
        console.error("Error fetching messages: QuerySnapshot is null");
      }
      });

    return () => unsubscribe();
  }, []);

  const handleSend = () => {
    const { uid, email } = auth.currentUser;

    firestore.collection('messages').add({
      text: message,
      createdAt: new Date(),
      user: {
        _id: uid,
        email,
      },
      users: [uid, user.uid],
      media,
    });
    setMessage('');
    setMedia(null);
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMedia({ uri: result.uri, type: 'image' });
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    if (result.type !== 'cancel') {
      setMedia({ uri: result.uri, type: 'document' });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        inverted
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item.user.email}: {item.text}</Text>
            {item.media && (
              item.media.type === 'image' ? (
                <Image source={{ uri: item.media.uri }} style={styles.image} />
              ) : (
                <Text>Document: {item.media.uri}</Text>
              )
            )}
            <Text style={styles.timestamp}>{moment(item.createdAt).format('lll')}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  message: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    fontSize: 24,
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginTop: 5,
  },
});

export default Chat;
