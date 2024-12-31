import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import moment from 'moment';

const Chat = ({ route }) => {
  const { user } = route.params;
  const [message, setMessage] = useState('');
  const [groupedMessages, setGroupedMessages] = useState([]);
  const chatId = [auth.currentUser.uid, user.uid].sort().join('_'); // Unique chat ID for both users

  useEffect(() => {
    const unsubscribe = firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          if (!querySnapshot.empty) {
            const messages = querySnapshot.docs.map((doc) => ({
              _id: doc.id,
              text: doc.data().text,
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              user: doc.data().user || null,
            }));

            const grouped = groupMessagesByDate(messages);
            setGroupedMessages(grouped);
          } else {
            console.warn("No messages found for this chat.");
          }
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );

    return () => unsubscribe();
  }, [chatId]);

  const groupMessagesByDate = (messages) => {
    const grouped = [];
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');

    let currentLabel = '';

    messages.forEach((msg) => {
      const messageDate = moment(msg.createdAt).startOf('day');
      let label;

      if (messageDate.isSame(today, 'day')) {
        label = 'Today';
      } else if (messageDate.isSame(yesterday, 'day')) {
        label = 'Yesterday';
      } else {
        label = messageDate.format('LL');
      }

      if (currentLabel !== label) {
        grouped.push({ type: 'date', label });
        currentLabel = label;
      }

      grouped.push({ type: 'message', ...msg });
    });

    return grouped;
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const { uid, email } = auth.currentUser;
    const newMessage = {
      text: message,
      createdAt: new Date(),
      user: {
        _id: uid,
        email,
      },
    };

    try {
      await firestore
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add(newMessage);

      // Ensure chat document exists and add participants
      await firestore
        .collection('chats')
        .doc(chatId)
        .set(
          {
            participants: [uid, user.uid],
          },
          { merge: true } // Prevent overwriting
        );

      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={groupedMessages}
        keyExtractor={(item, index) => (item.type === 'date' ? `date-${item.label}` : item._id || index.toString())}
        renderItem={({ item }) =>
          item.type === 'date' ? (
            <Text style={styles.dateHeader}>{item.label}</Text>
          ) : (
            <View
              style={[
                styles.message,
                item.user._id === auth.currentUser.uid ? styles.sent : styles.received,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>
                {moment(item.createdAt).format('h:mm A')}
              </Text>
            </View>
          )
        }
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="gray"
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
  dateHeader: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    color: '#000',
  },
});

export default Chat;
