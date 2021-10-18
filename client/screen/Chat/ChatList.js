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
    TouchableHighlight
} from 'react-native'

import {SwipeListView} from 'react-native-swipe-list-view';
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

    const deleteChat = async () => {

    }

    return(
        <SafeAreaView style={inpageStyle.container}>
            <SwipeListView
                data = {chatList}
                disableRightSwipe={true}
                recalculateHiddenLayout={true}
                renderItem={ (data, rowMap) => (
                    <TouchableHighlight
                        onPress={()=>{
                            props.navigation.navigate({
                                routeName: 'Chat',
                                params: data.item._id
                            })
                        }}
                    >
                        <View style={inpageStyle.rowFront}>
                            <Image style={inpageStyle.avatar} source={logo}/>
                            <Text style={inpageStyle.name}>{data.item.participants[0]}</Text>
                        </View>
                    </TouchableHighlight>

                )}
                renderHiddenItem={ (data, rowMap) => (
                    <TouchableOpacity
                        style={[inpageStyle.backRightBtn]}
                        onPress={() => {deleteChat(data.item._id)}}
                    >
                        <View>
                            <Text>Delete</Text>
                        </View>
                    </TouchableOpacity>
                )}
                rightOpenValue={-75}
            />
            <Footer navigation={props.navigation}/>
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
        fontFamily: 'timeburner',
        fontSize: 20,
        fontWeight: "500",
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
        flex:1,
        flexDirection:"row",
        backgroundColor: 'white',
        height: height*0.12
    },
    backRightBtn: {
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
        marginRight: width*0.10,
        marginTop:height*0.01,
        height: height*0.10,
        width: width*0.20,
        borderRadius: 400/ 2,
    },
    container:{
        backgroundColor: '#e1e1ea',
        flex: 1,
    }
});
export default ChatListScreen
