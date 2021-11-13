import React, {useState, useEffect} from 'react'
import {
    View,
    Text,
    BackHandler,
    TextInput,
    ImageBackground,
    TouchableOpacity,
    Alert,
    ActivityIndicator, StyleSheet, Dimensions, ScrollView
} from 'react-native'
import {styles} from '../styles'
import { Icon } from 'react-native-elements'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NavigationActions, StackActions} from "react-navigation";
const image = require('../../assets/bg.png')
const handler = require('../Handler')
const fixer = require('../Fixer')
const endpoints = require('../../API_endpoints.json')
const texts = require("../../assets/Texts.json");
const {height, width} = Dimensions.get('window');


const LoginScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const renderLoadingIcon = () => {
        if(isLoading){
            return(
                <ActivityIndicator size="large" style={styles.loading} color="#ffffff" />
            )
        }
    }
    const loginSubmit = async (email, password, props) => {
        setIsLoading(true)
        const body = {
            _id: fixer.email(email),
            password: password
        }
        const response = await handler.sendRequest(
            endpoints.Server.User.Auth.Login,
            texts.HTTP.Post,
            body,
            false,
            props
        )

        if(response.ok){
            const responseJson = await response.json();
            await AsyncStorage.setItem('accessToken', responseJson.accessToken)
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })],
            });
            props.navigation.dispatch(resetAction)
            setIsLoading(false)
        }
        setIsLoading(false)
    }

    return (
        <ImageBackground source={image} defaultSource={image} resizeMode="cover" style={styles.image}>
            <ScrollView style={{paddingTop: height*0.05}}>
                <View style={{
                    alignItems:"flex-start"
                }}>
                    <Icon name="chevron-left" size={35} color="white" type="fontawesome5" style={{
                        marginLeft:width*0.02
                    }}
                          onPress={()=>{
                              props.navigation.navigate({
                                  routeName: 'Splash'
                              })
                          }}
                    />
                </View>
                <View>
                    <Text style={inpageStyle.Header}>
                        {texts.Global.Common.Login}
                    </Text>

                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeEmail}
                        value={email}
                        placeholder={texts.Global.Common.Email}
                        placeholderTextColor="white"
                        autoCapitalize='none'
                    />
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangePassword}
                        value={password}
                        secureTextEntry={true}
                        placeholder={texts.Global.Common.Password}
                        placeholderTextColor="white"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            loginSubmit(email, password, props).then()
                        }}
                        style={inpageStyle.Button}>
                        <Text style={styles.font}>{texts.Global.Common.Login}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate({
                                routeName: 'GetEmail'
                            })
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>{texts.Global.Common.ForgotPassword}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {renderLoadingIcon()}
        </ImageBackground>
    );
};

const inpageStyle = StyleSheet.create({
    Header: {
        fontSize: 50,
        marginLeft: width * 0.28,
        marginTop : height * 0.12,
        marginBottom: height * 0.03,
        color: "white",
        fontFamily: 'timeburner',
    },
    Button: {
        width: width * 0.6,
        height: height * 0.06,
        marginTop: height * 0.05,
        marginBottom: height * 0.04,
        marginLeft: width * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
    }
})
export default LoginScreen;
