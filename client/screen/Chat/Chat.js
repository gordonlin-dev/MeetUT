import React, {useState, useEffect, useCallback} from 'react'
import socketClient  from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
const secureStore = require('../../SecureStore')

let socket;
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
            let url = 'https://meet-ut-3.herokuapp.com/chat'
            url = url + "/" + userID
            url = url + "/room/" + roomID
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
            getMessages()
            socket.emit('joinRoom', roomID)
        })
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
