import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'
import socketClient  from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
const secureStore = require('../../SecureStore')

const socket = socketClient("https://meet-ut-3.herokuapp.com/");
const ChatScreen = props => {
    const [messages, setMessages] = useState([]);

    const sendMessage = (message) => {
        socket.emit('message', message)
    }

    const onSend = useCallback((message = []) => {
        console.log(message)
        sendMessage(message);
        setMessages(previousMessages => GiftedChat.append(previousMessages, message, false))
    }, [])

    useEffect(() => {

    }, []);

    return (
        <GiftedChat
            messages={messages}
            inverted={false}
            onSend={message => onSend(message)}
            user={{
                _id: 1,
            }}
        />
    );
};

export default ChatScreen;
