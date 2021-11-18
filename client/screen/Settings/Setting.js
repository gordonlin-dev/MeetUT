import React, {useState, useEffect} from 'react'
import {
    View,
    Text,
    Image,
    BackHandler,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    DevSettings,
    Alert
} from 'react-native'
import {styles} from '../styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from '../Footer';
import { withNavigation } from 'react-navigation';
const image = require('../../assets/bg.png');
const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
import avatars from '../../Avatars'

const {height, width} = Dimensions.get('window')
const signOutSubmit = async () => {
    await AsyncStorage.setItem('accessToken', "")
    DevSettings.reload()
}


const deleteButton = async (props) => {
    try {
        const response = await handler.sendRequest(
            endpoints.Server.User.User.Delete,
            texts.HTTP.Delete,
            {},
            true,
            props
        )

        if (response.ok) {
            Alert.alert("", texts.Alert.Message.Deleted)
            await AsyncStorage.setItem('accessToken', "")
            DevSettings.reload()
        } else {
            await handler.handleResponse(response, props)
        }
    } catch (error) {
        console.log(error)
    }
}

const SettingScreen = props => {
    useEffect(() => {
        getProfile().then()
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState(0);
    const getProfile = async () => {
        const response = await handler.sendRequest(
            endpoints.Server.User.User.baseURL,
            texts.HTTP.Get,
            {},
            false,
            props
        )

        if (response.ok) {
            const responseJson = await response.json();
            setLastName(responseJson.lastName)
            setFirstName(responseJson.firstName)
            setEmail(responseJson._id)
            if (typeof responseJson.avatar !== 'undefined') {
                setAvatar(responseJson.avatar)
            }
        }
    }


    return (
        <View style={styles.empty}>
            <ImageBackground source={image} defaultSource={image} resizeMode="cover" style={styles.image}>
                <View style={{
                    flex:1,
                    flexDirection:"column",
                }}>
                    <View style={{
                        height: height * 0.1,
                        width: width,
                        flex: 2,
                        flexDirection: 'row',
                        alignItems:"center"
                    }}>
                        <View style={{
                            flex:3,
                            alignItems:"center"
                        }}>
                            <Image style={{
                                height: height*0.12,
                                width: height * 0.12,
                                borderRadius: height * 0.12/ 2,
                                marginBottom:height * 0.02
                            }} source={avatars[avatar].source}/>
                            <Text style={{
                                fontFamily: 'timeburner',
                                fontSize: 30,
                                color: "white",
                                fontWeight: "500"
                            }}>{firstName + ' ' + lastName}</Text>
                        </View>
                    </View>
                    <View style={{
                        flex:5
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                signOutSubmit(props).then()
                            }}
                            style={styles.Button}>
                            <Text style={styles.font}>Sign Out</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate({
                                    routeName: 'ResetPassword'
                                })
                            }}
                            style={styles.Button}>
                            <Text style={styles.font}>Reset Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate({
                                    routeName: 'ChangeAvatar'
                                })
                            }}
                            style={styles.Button}>
                            <Text style={styles.font}>Change Avatar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate({
                                    routeName: 'Demographics'
                                })
                            }}
                            style={styles.Button}>
                            <Text style={styles.font}>Preferences</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                deleteButton(props).then()
                            }}
                            style={styles.Button}>
                            <Text style={{
                                fontFamily: 'timeburner',
                                fontSize: 18,
                                color: "red",
                                fontWeight: "500"
                            }}>Delete Account</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <Footer navigation={props.navigation}/>
            </ImageBackground>

        </View>


    );
};

const inpageStyle = StyleSheet.create({
    profile: {

    },
})
export default SettingScreen;
