import React, {useState, useEffect, useCallback} from 'react'
import {Image, StyleSheet, Dimensions, BackHandler, View, Text, TouchableWithoutFeedback} from 'react-native'
import socketClient  from "socket.io-client";
import {Bubble, GiftedChat, Message} from 'react-native-gifted-chat';
import AsyncStorage from "@react-native-async-storage/async-storage";
const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')

let socket;
const {height, width} = Dimensions.get('window');
const example_profilepic =  require('../../assets/logo.png')

const ChatScreen = props => {

    const [messages, setMessages] = useState([]);
    const roomID = props.navigation.state.params.chatRoom;

    const sendMessage = async (message) => {
        socket.emit('message', {roomID: roomID, chatMessage:message})
    }

    const onSend = useCallback(async (message = []) => {
        await sendMessage(message);
        setMessages(previousMessages => GiftedChat.append(previousMessages, message, false))
    }, [])

    const getMessages = async () => {
        const response = await handler.sendRequest(
            endpoints.Server.Chat.GetChatRoom + roomID,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if(response.ok){
            const responseJson = await response.json();
            const messages = responseJson.messages
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages, false))
            //setMessages(messages)
        }
    }
    const connectToSocket = async () => {
        const token = await AsyncStorage.getItem('accessToken')
        socket = socketClient(endpoints.Server.Chat.baseURL)
        socket.on('connect', () =>{
                socket.emit('authenticate', token)
            }
        );
        socket.on('authenticated', async () =>{
            await getMessages()
            socket.emit('joinRoom', roomID)
        })
        socket.on('broadcast', (message) =>{
            message[0].user._id = 2
            setMessages(previousMessages => GiftedChat.append(previousMessages, message, false))
        })
    }
    useEffect(() => {
        connectToSocket().then()
    }, []);

    useEffect( () => () => {
        socket.disconnect()

    }, [] );

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', () => true)
        }
    }, [])

    const renderBubble = props => {
        return(
            <Bubble
                {...props}
                textStyle={{
                    //right: {
                    //    color: 'yellow',
                    //},
                }}
                wrapperStyle={{
                    left: {
                        backgroundColor: 'white',
                        marginTop:height*0.01
                    },
                }}
            />
        )
    }
    const renderMessage = props => {
        console.log(props.currentMessage)
        return(
            <View>
                <TouchableWithoutFeedback>
                    <Message
                        {...props}
                        containerStyle={{
                            left:{
                                flexDirection:"row",
                                alignItems:"center"
                            }
                        }}
                    />
                </TouchableWithoutFeedback>
            </View>
        )
    }
    return (
        <View style={{backgroundColor:"#d2d2d2", flex:1}}>
            <GiftedChat
                renderAvatar={() => {
                    return (
                        <Image source={example_profilepic} style={styles.tinyLogo}/>
                    )
                }}
                showAvatarForEveryMessage={true}
                messages={messages}
                inverted={false}
                onSend={message => onSend(message)}
                user={{
                    _id: 1,
                }}
                renderBubble={renderBubble}
                renderMessage={renderMessage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    tinyLogo: {
        borderRadius: 25,
        width: 50,
        height: 50,
        marginTop: height*0.01
    }
  });

export default ChatScreen;
