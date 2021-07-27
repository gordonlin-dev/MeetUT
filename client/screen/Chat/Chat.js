import React, {useState, useEffect, useCallback} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'
import socketClient  from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
const secureStore = require('../../SecureStore')

let socket;
const ChatScreen = props => {
    const id = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    const [messages, setMessages] = useState([]);

    const sendMessage = (message) => {
        socket.emit('message', message)
    }

    const onSend = useCallback((message = []) => {
        sendMessage(message);
        setMessages(previousMessages => GiftedChat.append(previousMessages, message, false))
    }, [])

    useEffect(() => {
        console.log('connect')
        socket = socketClient("https://meet-ut-3.herokuapp.com/")
        socket.on('broadcast', (message) =>{
            setMessages(previousMessages => GiftedChat.append(previousMessages, message, false))
        })
    }, []);

    useEffect( () => () => {
        console.log('disconnect')
        socket.disconnect()
    }, [] );

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
