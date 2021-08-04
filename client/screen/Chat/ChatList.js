import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'

const secureStore = require('../../SecureStore')

const ChatListScreen = props => {
    const loadChat = async () => {
        try {
            let url = 'https://meet-ut-3.herokuapp.com/chat'
            url = url + "/" + "bob@bob.com"
            const response = await fetch(url, {
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //'authorization': 'Bearer ' + jwt
                },
            });
            const responseJson = await response.json();
            console.log(responseJson)
        }catch (e) {
            console.log(e)
        }
    }
    useEffect( () => {
        loadChat()
    }, []);

    return(
        <SafeAreaView>
            <Text>ABC</Text>
        </SafeAreaView>
    )
}

export default ChatListScreen
