import React, {useState, useEffect} from 'react'
import {View, Text, BackHandler, TextInput, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from '../styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
const image = require('../../assets/bg.png');
const fixer = require('../Fixer')
const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')


const emailSubmit = async (email, props) => {
    const body = {
        _id : email
    }
    const response = await handler.sendRequest(
        endpoints.Server.User.User.ResendPasswordCode,
        texts.HTTP.Post,
        body,
        false,
        props
    )
    if(response.ok){
        await AsyncStorage.setItem('resetPasswordEmail', email)
        props.navigation.navigate({
            routeName: 'ForgotPassword'
        })
    }
}
const GetEmailScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const [email, onChangeEmail] = useState("")

    return (
        <View style={styles.empty}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <View>
                    <Text style={styles.verificationHeader}>
                        {texts.Screens.Verification.Verification}
                    </Text>
                    <View style={styles.pickerHeader}>
                        <Text style={[styles.quizFont, {color: "white"}]}>{texts.Screens.Verification.EnterEmail}</Text>
                    </View>

                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeEmail}
                        value={email}
                        autoCapitalize='none'
                        placeholder={texts.Global.Common.Email}
                        placeholderTextColor="white"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            emailSubmit(email, props).then()
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>{texts.Global.Common.Submit}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default GetEmailScreen;
