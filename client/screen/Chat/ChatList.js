import React, {useState, useEffect} from 'react'
import {View, TouchableOpacity, StyleSheet, Button, Image, Dimensions, SafeAreaView, FlatList, BackHandler} from 'react-native'

const secureStore = require('../../SecureStore')

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
            const userId = await secureStore.GetValue('UserId');
            let url = 'https://meet-ut-3.herokuapp.com/chat'
            url = url + "/" + userId
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
        marginTop: height * 0.82
    },
    footerButton:{
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    icon: {
      height: height*0.05,
      width: width*0.1
  }
  });
export default ChatListScreen
