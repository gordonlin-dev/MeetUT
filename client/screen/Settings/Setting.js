import React, {useState, useEffect} from 'react'
import {View, Text, Image, BackHandler, ImageBackground, TouchableOpacity, Alert, DevSettings} from 'react-native'
import {styles} from '../styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
const home =  require('../../assets/home-icon.png');
const setting =  require('../../assets/setting-icon.png');
const chat =  require('../../assets/chat-icon.png');
const image =  require('../../assets/bg.png');
const logo = require('../../assets/logo.png')

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')

const signOutSubmit = async (props) => {
    await AsyncStorage.setItem('accessToken', "")
    DevSettings.reload()
}

/* Delete user function here, saw the function in controller, not sure how to call it
*/
const deleteButton = async (props) => {
    // TODO
}

const SettingScreen = props => {
    useEffect(() => {
        getProfile()
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const getProfile = async () => {
        const response = await handler.sendRequest(
            endpoints.Server.User.User.baseURL,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if (response.ok){
            const responseJson = await response.json();
            setLastName(responseJson.lastName)
            setFirstName(responseJson.firstName)
            setEmail(responseJson._id)
        }
    }

    return (
        <View style={styles.empty}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image} >
                <View style={styles.profile}>
                    <Image style={styles.avatar} source={logo}/>
                <View style={styles.chat}>
                    <Text style={styles.font}>{firstName + ' ' + lastName}</Text>
                    <Text style={styles.font}>{email}</Text>
                </View>

                </View>
                <View style={styles.buttonInRow}>
                <TouchableOpacity
                    onPress={() => {
                        signOutSubmit(props)
                    }}
                    style={styles.Button}>
                    <Text style={styles.font}>{texts.Screens.Settings.SignOut}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate({
                        routeName: 'ResetPassword'
                        })
                    }}
                    style={styles.Button}>
                    <Text style={styles.font}>{texts.Screens.ResetPassword.ResetPassword}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => {
                        deleteButton(props)
                    }}
                    style={styles.Button}>
                    <Text style={styles.font}>{texts.Screens.Settings.Delete}</Text>
                    </TouchableOpacity>
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
            </ImageBackground>

        </View>


        );
};


export default SettingScreen;
