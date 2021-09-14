import React, {useState, useEffect} from 'react'
import {
    View,
    Image,
    StyleSheet,
    Button,
    BackHandler,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Alert
} from 'react-native'
import Footer from "../Footer";
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
        const matchResponse = await handler.sendRequest(
            endpoints.Server.User.User.baseURL,
            texts.HTTP.Get,
            {},
            false,
            props
        )

        if(matchResponse.ok){
            const responseJson = await matchResponse.json();
            if(! responseJson.completedOnboarding){
                Alert.alert(texts.Alert.Title.CompleteSignUp,
                    "",
                    [{text: texts.Alert.Buttons.OK, onPress: () => props.navigation.navigate({
                            routeName: "Demographics"
                        })}])
            }else{
                const body = {
                    excludedUsers: responseJson.matched
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
        }
    }

    useEffect(() => {
        loadUser()
    }, []);

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.empty}>
                {/*<ProfileCard style={styles.homeBg} users={users}/>*/}
            <Footer navigation={props.navigation}/>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;
