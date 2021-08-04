import React, {useState, useEffect, useCallback} from 'react'
import socketClient  from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
const secureStore = require('../../SecureStore')

let socket;
const ChatScreen = props => {

    const [messages, setMessages] = useState([]);
    //const {chatID} = props.navigation.navigate.route.params;
    const roomID = props.navigation.state.params;

    const sendMessage = (message) => {
        socket.emit('message', {userID: "bob@bob.com",roomID: roomID, chatMessage:message})
    }

    const onSend = useCallback((message = []) => {
        sendMessage(message);
        console.log(message)
        setMessages(previousMessages => GiftedChat.append(previousMessages, message, false))
    }, [])

    const getMessages = async () => {
        try{
            let url = 'https://meet-ut-3.herokuapp.com/chat'
            url = url + "/" + "bob@bob.com"
            url = url + "/chat/" + roomID
            const response = await fetch(url, {
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //'authorization': 'Bearer ' + jwt
                },
            });
            const responseJson = await response.json();
            const messages = responseJson.messages
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages, false))

        }catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        socket = socketClient("https://meet-ut-3.herokuapp.com/")
        socket.on('connection', () => {
            socket.emit('joinRoom', roomID)
        })
        socket.on('broadcast', (message) =>{
            message[0].user._id = 2
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
