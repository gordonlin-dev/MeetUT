import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, Dimensions, SafeAreaView, FlatList} from 'react-native'

const secureStore = require('../../SecureStore')

const ChatListScreen = props => {
    const [chatList, setChatList] = useState([])

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
            setChatList(responseJson)
        }catch (e) {
            console.log(e)
        }
    }
    useEffect( () => {
        loadChat()
    }, []);

    useEffect( () => {

    }, [chatList])

    return(
        <SafeAreaView>
            <View>
                <FlatList data={chatList}
                          renderItem={({item}) => <Button title={item.participants[0]} onPress={() => {
                              props.navigation.navigate({
                                  routeName: 'Chat',
                                  params: item._id
                              })
                          }}/>}
                          keyExtractor={(item, _id) => _id.toString()}
                />
            </View>
        </SafeAreaView>
    )
}

export default ChatListScreen
