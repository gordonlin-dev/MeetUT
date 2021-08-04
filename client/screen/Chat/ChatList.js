import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView} from 'react-native'

const secureStore = require('../../SecureStore')

const ChatListScreen = props => {
    const loadChat = async () => {
        try {
            const url = 'https://meet-ut-3.herokuapp.com/chat'
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

        }
    }
    useEffect(async () => {
        await loadChat()
    }, []);

    return(
        <SafeAreaView>
            <Text>ABC</Text>
        </SafeAreaView>
    )
}
