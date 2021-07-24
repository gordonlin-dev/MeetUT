import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'
import socketClient  from "socket.io-client";
const secureStore = require('../SecureStore')

const ChatScreen = props => {
    const connectToChat = () =>{
        const socket = socketClient("https://meet-ut-3.herokuapp.com/")
        socket.on('connection', () => {
            console.log(`connected`)
        });
    }

    useEffect(() => {
        connectToChat();
    }, []);

    return (
        <View>

        </View>
    );
};

export default ChatScreen;
