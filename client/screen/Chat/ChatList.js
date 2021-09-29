import React, {useState, useEffect} from 'react'

import {View, TouchableOpacity, StyleSheet, Image, Dimensions, SafeAreaView, FlatList, Text, BackHandler} from 'react-native'

import Swipeable from 'react-native-swipeable-row';
import Footer from '../Footer';
import { styles } from '../styles';
const logo = require('../../assets/logo.png');
const {height, width} = Dimensions.get('window');
const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')

const ChatListScreen = props => {
    useEffect(() => {
        loadChat()
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    const [chatList, setChatList] = useState([])

    const loadChat = async () => {
        const response = await handler.sendRequest(
            endpoints.Server.Chat.GetChatList,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if (response.ok){
            const responseJson = await response.json();
            setChatList(responseJson)
        }
    }

    const rightButtons = [
    <TouchableOpacity style={inpageStyle.Button}>
        <Text style={styles.font}>Delete</Text>
    </TouchableOpacity>
    ];
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.homeBg}>
                <FlatList data={chatList}
                    renderItem={({item}) =>
                        <Swipeable leftContent={<Text style={styles.font}>Read</Text>} rightButtons={rightButtons}>
                            <View style={inpageStyle.list}>
                                <Image style={styles.avatar} source={logo}/>
                                <TouchableOpacity style={inpageStyle.chat} onPress={() => {
                                    props.navigation.navigate({
                                        routeName: 'Chat',
                                        params: item._id
                                    })
                                }}>
                                    <View>
                                    <Text style={inpageStyle.name}>{item.participants[0]}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </Swipeable>

                    }
                    keyExtractor={(item, _id) => _id.toString()}
                />
            </View>
            <Footer navigation={props.navigation}/>
        </SafeAreaView>
    )
}
const inpageStyle = StyleSheet.create({
    list: {
        height: height*0.1,
        backgroundColor: "#e1e1ea",
        flexDirection: 'row'
    },
    name: {
        fontFamily: 'timeburner',
        fontSize: 20,
        fontWeight: "500"
    },
    Button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'red',
        width: width*0.2,
        height: height*0.1
    },
    chat: {
        height: height*0.1,
        marginLeft: width*0.02

    }
});
export default ChatListScreen
