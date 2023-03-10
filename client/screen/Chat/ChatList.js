import React, {useState, useEffect} from 'react'

import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    FlatList,
    Text,
    BackHandler,
    ActivityIndicator,
    TouchableHighlight, Alert, TouchableWithoutFeedback
} from 'react-native'

import {SwipeListView} from 'react-native-swipe-list-view';
import Footer from '../Footer';
import { styles } from '../styles';
import avatars from "../../Avatars";
const logo = require('../../assets/logo.png');
const {height, width} = Dimensions.get('window');
const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
import { Icon } from 'react-native-elements'
import {Touchable} from "react-native-web";

const ChatListScreen = props => {
    useEffect(() => {
        loadChat()
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    const [chatList, setChatList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const renderLoadingIcon = () => {
        if(isLoading){
            return(
                <ActivityIndicator size="large" style={styles.loading} color="#0000ff" />
            )
        }
    }

    const loadChat = async () => {
        setIsLoading(true)
        const response = await handler.sendRequest(
            endpoints.Server.Chat.GetChatList,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if (response.ok){
            setIsLoading(false)
            const responseJson = await response.json();
            for (let i = 0; i < responseJson.length; i++){
                responseJson[i]["key"]= responseJson[i]._id
            }
            setChatList(responseJson)
        }
    }

    const deleteChat = async (roomId) => {
        setIsLoading(true)
        const response = await handler.sendRequest(
            endpoints.Server.Chat.GetChatRoom,
            texts.HTTP.Delete,
            {roomId:roomId},
            false,
            props
        )
        if(response.ok){
            setIsLoading(false)
            setChatList(chatList.filter(x => x._id !== roomId))
        }
    }

    const getAvatarSource = (id) =>{
        return avatars.filter(x => x.id === id)[0].source
    }

    const chatRoomNavigation = (chatRoom) => {
        if(!chatRoom.active){
            Alert.alert("Chat inactive",
                "The other user has left the chat.",
                [{text: texts.Alert.Buttons.OK, onPress: () => {
                        props.navigation.navigate({
                            routeName: 'Chat',
                            params: {
                                chatRoom :chatRoom._id,
                                displayName: chatRoom.displayName
                            }
                        })
                    }}])

        }else{
            props.navigation.navigate({
                routeName: 'Chat',
                params: {
                    chatRoom :chatRoom._id,
                    displayName: chatRoom.displayName
                }
            })
        }
    }
    return(
        <SafeAreaView style={inpageStyle.container}>
            <SwipeListView
                data = {chatList}
                disableRightSwipe={true}
                recalculateHiddenLayout={true}
                renderItem={ (data, rowMap) => (
                    <TouchableWithoutFeedback
                        onPress={()=>{
                            chatRoomNavigation(data.item)
                        }}
                    >
                        <View style={inpageStyle.rowFront}>
                            <Image style={inpageStyle.avatar} source={getAvatarSource(data.item.displayAvatar)}/>
                            <View style={{
                                alignSelf:"center"
                            }}>
                                <Text style={inpageStyle.name}>{data.item.displayName}</Text>
                            </View>
                            <View style={{
                                flex:1,
                                flexDirection:"column",
                                alignSelf:"center"
                            }}>
                                <View style={{alignSelf:"flex-end"}}>
                                    <Icon name="chevron-right" size={30} color="rgb(0,41,93)" type="fontawesome5" style={{
                                        marginRight: width*0.05
                                    }}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                )}
                renderHiddenItem={ (data, rowMap) => (
                    <TouchableOpacity
                        style={[inpageStyle.backRightBtn]}
                        onPress={() => {deleteChat(data.item._id)}}
                    >
                        <Icon name="trash-outline" size={33} color="white" type="ionicon" style={{
                        }}
                        />
                    </TouchableOpacity>
                )}
                rightOpenValue={-75}
            />
            <Footer navigation={props.navigation} isLoading={isLoading}/>
            {renderLoadingIcon()}
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
        fontSize: 20,
        marginTop:height*0.01,
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

    },
    rowFront: {
        flexDirection:"row",
        backgroundColor: 'white',
        marginTop:height * 0.02
    },
    backRightBtn: {
        marginTop:height * 0.02,
        flex:1,
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        backgroundColor: 'red',
        right: 0,
    },
    avatar: {
        marginLeft: width * 0.05,
        marginRight: width*0.05,
        marginTop:height*0.02,
        marginBottom:height * 0.02,
        height: height*0.07,
        width: height*0.07,
        borderRadius: height*0.10/ 2,
    },
    container:{
        paddingTop:height * 0.01,
        backgroundColor: '#d2d2d2',
        flex: 1,
    }
});
export default ChatListScreen
