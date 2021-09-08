import React, {useState, useEffect} from 'react'

import {View, TouchableOpacity, StyleSheet, Image, Dimensions, SafeAreaView, FlatList, Text, BackHandler} from 'react-native'

import Swipeable from 'react-native-swipeable-row';

const secureStore = require('../../SecureStore')
const headers = require('../Headers')

const logo = require('../../assets/logo.png');
const home =  require('../../assets/home-icon.png');
const setting =  require('../../assets/setting-icon.png');
const chat =  require('../../assets/chat-icon.png');
const {height, width} = Dimensions.get('window');
const ChatListScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    const [chatList, setChatList] = useState([])

    const loadChat = async () => {
        try {
            const userId = await secureStore.GetValue('UserId'); // TODO: Find a way to remove dependency on UserId
            const accessToken = await secureStore.GetValue('JWT')
            let url = 'https://meet-ut-3.herokuapp.com/chat'
            url = url + "/" + userId
            const response = await fetch(url, {
                method : 'GET',
                headers: headers.authorized(accessToken),
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

    const rightButtons = [
    <TouchableOpacity style={styles.Button}>
        <Text style={styles.font}>Block</Text>
    </TouchableOpacity>,
    <TouchableOpacity style={styles.Button}>
        <Text style={styles.font}>Archive</Text>
    </TouchableOpacity>
    ];
    console.log(chatList)
    return(
        <SafeAreaView>
            <View>
            <FlatList data={chatList}
                        renderItem={({item}) => 
                            <Swipeable leftContent={<Text style={styles.font}>Read</Text>} rightButtons={rightButtons}>
                                <View style={styles.list}>
                                    <Image style={styles.avatar} source={logo}/>
                                    <TouchableOpacity style={styles.chat} onPress={() => {
                                        props.navigation.navigate({
                                            routeName: 'Chat',
                                            params: item._id
                                        })
                                    }}>
                                        <View>
                                        <Text style={styles.name}>{item.participants[0]}</Text>
                                        </View>
                                        
                                        

                                    </TouchableOpacity>
                                
                                </View>
                                
                            </Swipeable>
                             
                        }
                        keyExtractor={(item, _id) => _id.toString()}
                    />
            
                
            </View>
            <View style={styles.footer}>
                <View style={styles.footerButton}>
                  <TouchableOpacity onPress={() => {
                      props.navigation.navigate({
                          routeName: 'Setting'
                      })
                  }}>
                      <Image style={styles.icon} source={setting}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                      props.navigation.navigate({
                          routeName: 'Home'
                      })
                  }}>
                      <Image style={styles.icon} source={home}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                      props.navigation.navigate({
                          routeName: 'ChatList'
                      })
                  }}>
                      <Image style={styles.icon} source={chat}/>
                  </TouchableOpacity>
                    
                </View>
                
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    footer: {
        justifyContent: 'space-around',
        alignItems: 'stretch',
        backgroundColor: '#3590F2',
        height: height * 0.1,
        marginTop: height * 0.82,
        position: "absolute",
        width: width
    },
    footerButton:{
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    avatar: {
        marginTop: height*0.01,
        marginLeft: width*0.01,
        height: height*0.08,
        width: width*0.16,
        borderRadius: 400/ 2,
    },
    icon: {
        height: height*0.05,
        width: width*0.1
    },
    list: {
        height: height*0.1,
        backgroundColor: "#e1e1ea",
        flexDirection: 'row'
    },
    font: {
        fontFamily: 'timeburner',
        fontSize: 18,
        color: "white",
        fontWeight: "500"
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
        backgroundColor: '#3590F2',
        width: width*0.2,
        height: height*0.1
    },
    chat: {
        height: height*0.1,
        marginLeft: width*0.02
        
    }
});
export default ChatListScreen
