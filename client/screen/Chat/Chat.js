import React, {useState, useEffect, useCallback} from 'react'
import {Image, StyleSheet, Dimensions, backHandler} from 'react-native'
import socketClient  from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
const secureStore = require('../../SecureStore')
const headers = require('../Headers')

let socket;
const {height, width} = Dimensions.get('window');
const example_profilpic =  require('../../assets/logo.png')

const ChatScreen = props => {

    const [messages, setMessages] = useState([]);
    //const {chatID} = props.navigation.navigate.route.params;
    const roomID = props.navigation.state.params;

    const sendMessage = async (message) => {
        const userID = await secureStore.GetValue('UserId');
        console.log(message)
        socket.emit('message', {userID: userID, roomID: roomID, chatMessage:message})
    }

    const onSend = useCallback(async (message = []) => {
        await sendMessage(message);
        setMessages(previousMessages => GiftedChat.append(previousMessages, message, false))
    }, [])

    const getMessages = async () => {
        try{
            const userID = await secureStore.GetValue('UserId');
            const accessToken = await secureStore.GetValue('JWT')
            let url = 'https://meet-ut-3.herokuapp.com/chat'
            url = url + "/" + userID
            url = url + "/room/" + roomID
            const response = await fetch(url, {
                method : 'GET',
                headers: headers.authorized(accessToken),
            });
            const responseJson = await response.json();
            const messages = responseJson.messages
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages, false))

        }catch (e) {
            console.log(e)
        }
    }

    useEffect(async () => {
        const jwt = await secureStore.GetValue('JWT');
        socket = socketClient("https://meet-ut-3.herokuapp.com/")
        socket.on('connect', () =>{
                socket.emit('authenticate', {jwt})
            }
        );
        socket.on('authenticated', () =>{
            getMessages()
            socket.emit('joinRoom', roomID)
        })
        /*
        socket.on('connection', () => {
            getMessages()
            socket.emit('joinRoom', roomID)
        })*/
        socket.on('broadcast', (message) =>{
            console.log(message)
            message[0].user._id = 2
            setMessages(previousMessages => GiftedChat.append(previousMessages, message, false))
        })
    }, []);

    useEffect( () => () => {
        console.log('disconnect')
        socket.disconnect()
    }, [] );

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    return (
        <GiftedChat
            renderAvatar={() => {
                return (
                    <Image source={example_profilpic} style={styles.tinyLogo}/>
                )
            }}
            // TODO: doesn't work as expected. Needs further investigation on how to use onPressAvatar
            onPressAvatar={props => {props.navigation.navigate('ChatList')}}
            messages={messages}
            inverted={false}
            onSend={message => onSend(message)}
            user={{
                _id: 1,
            }}
        />
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
