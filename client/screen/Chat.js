import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'
import io from "socket.io-client";
const secureStore = require('../SecureStore')

const ChatScreen = props => {
    const connectToChat = () =>{
        this.socket = io("https://meet-ut-3.herokuapp.com/");
        this.socket.on("connection", msg => {
            console.log('socket connected')
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
