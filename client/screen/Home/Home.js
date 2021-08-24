import React, {useState, useEffect} from 'react'
import {View, Image, StyleSheet, Button, ScrollView, Dimensions, SafeAreaView, TouchableOpacity} from 'react-native'
import ProfileCard from "./ProfileCard";
import Swiper from 'react-native-swiper';

const home =  require('../../assets/home-icon.png');
const setting =  require('../../assets/setting-icon.png');
const chat =  require('../../assets/chat-icon.png');

const secureStore = require('../../SecureStore')
const {height, width} = Dimensions.get('window');
const HomeScreen = props => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [curUser, setCurUser] = useState(0);
    const [users, setUsers] = useState([])

    const loadData = async () => {
        try{
            const jwt = await secureStore.GetValue('JWT');
            const userId = await secureStore.GetValue('UserId');
            const url = 'https://meet-ut-2.herokuapp.com/users/' + userId;
            const response = await fetch(url, {
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + jwt
                },
            });
            const responseJson = await response.json();
            setEmail(responseJson.email);
            setFirstName(responseJson.firstName);
            setLastName(responseJson.lastName);

        }catch (e){

        }
    }

    const loadUser = async () => {
        try{
            const userID = await secureStore.GetValue('UserId');
            const url = 'https://meet-ut-2.herokuapp.com/match' + '/' + userID
            const response = await fetch(url, {
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    //'authorization': 'Bearer ' + jwt
                },
            });
            const responseJson = await response.json();
            setUsers(responseJson)


        }catch (e) {
            console.log(e)
        }
    }

    const nextUser = async () => {
        await setCurUser(curUser + 1)
    }

    const sendLike = async () => {
        try{
            const jwt = await secureStore.GetValue('JWT');
            const userId = await secureStore.GetValue('UserId');
            const url = 'https://meet-ut-2.herokuapp.com/match/like';
            const response = await fetch(url, {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify({
                    curUser: userId,
                    likedUser: users[curUser].email
                })
            });
            if(response.status == 200){
                await nextUser();
            }
        }catch (e){
            console.log(e)
        }
    }

    useEffect(() => {
        //loadData();
        loadUser()
    }, []);

    useEffect(() => {
        //loadData();
        if(users.length > 0){
            setFirstName(users[curUser].firstName)
            setLastName(users[curUser].lastName)
        }
    }, [users, curUser]);

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.empty}>
                <ProfileCard style={styles.empty}/>
                
                <View style={styles.footer}>
                <View style={styles.footerButton}>
                <TouchableOpacity onPress={() => {
                        props.navigation.navigate({
                            routeName: 'Setting'
                        })
                    }}>
                    <Image style={styles.icon} source={setting}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}}>
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
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: height * 0.02,
        marginBottom: height * 0.02
    },
    empty:{
        flex:1,
    },
    footer: {
        justifyContent: 'space-around',
        alignItems: 'stretch',
        backgroundColor: '#3590F2',
        height: height * 0.1,
    },
    footerButton:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: height * 0.005
    },
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    icon: {
        height: height*0.05,
        width: width*0.1
    }
});


export default HomeScreen;
