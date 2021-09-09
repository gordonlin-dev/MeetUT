import React, {useState, useEffect} from 'react'
import {View, Image, StyleSheet, Button, BackHandler, Dimensions, SafeAreaView, TouchableOpacity} from 'react-native'
import ProfileCard from "./ProfileCard";
import { styles } from '../styles';
const home =  require('../../assets/home-icon.png');
const setting =  require('../../assets/setting-icon.png');
const chat =  require('../../assets/chat-icon.png');

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')

const HomeScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const [users, setUsers] = useState([])

    const loadUser = async () => {
        const body = {
            excludedUsers:[]
        }
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.Recommendations,
            texts.HTTP.Post,
            body,
            false,
            props
        )
        if(response.ok){
            const responseJson = await response.json();
            setUsers(responseJson)
        }
    }

    useEffect(() => {
        loadUser()
    }, []);

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.empty}>
                {/* <ProfileCard style={styles.homeBg} users={users}/> */}


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
