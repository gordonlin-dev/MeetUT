import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'
import socketClient  from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
const secureStore = require('../../SecureStore')

const ChatScreen = props => {
    const [messages, setMessages] = useState([]);
    const socket = socketClient("https://meet-ut-3.herokuapp.com/");
    socket.on('connection', () => {
        console.log(`connected`)
    });

    const sendMessage = (message) => {
        socket.send(JSON.stringify({
            message: message
        }));
    }

    const onSend = useCallback((message = []) => {
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
