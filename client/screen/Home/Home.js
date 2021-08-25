import React, {useState, useEffect} from 'react'
import {View, Image, StyleSheet, Button, BackHandler, Dimensions, SafeAreaView, TouchableOpacity} from 'react-native'
import ProfileCard from "./ProfileCard";
import { styles } from '../styles'; 

const home =  require('../../assets/home-icon.png');
const setting =  require('../../assets/setting-icon.png');
const chat =  require('../../assets/chat-icon.png');

const secureStore = require('../../SecureStore')
const HomeScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

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
                <ProfileCard style={styles.homeBg}/>
                
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

export default HomeScreen;
