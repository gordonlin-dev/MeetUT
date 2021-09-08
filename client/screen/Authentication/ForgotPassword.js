import React, {useState, useEffect} from 'react'
import {View, Text, BackHandler, TextInput, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from '../styles';
const image = require('../../assets/bg.png');
const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')



const emailSubmit = async (code, props) => {
    try {
        const url = cfg.domain + cfg.forgotPassword;
        const response = await fetch(url, {
            method: 'POST',
            headers: headers.unauthorized(),
            body: JSON.stringify({
                _id: await secureStore.GetValue("UserId"),
                verification: code
            })
        })

        if (response.status === 201) {
            const responseJson = await response.json();
            await secureStore.Save('JWT', responseJson.accessToken);
            props.navigation.navigate({
                routeName: 'ResetPassword'
            })
        } else {
            await handler.handle(response, props)
        }
    } catch (error) {
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}

const resend = async (props) => {
    try {
        const url = cfg.domain + cfg.forgotPasswordResend;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: await secureStore.GetValue("UserId")
            })
        });

        if (response.status === 201) {
            props.navigation.navigate({
                routeName: 'ForgotPassword'
            })
        } else {
            await handler.handle(response, props)
        }
    } catch (error) {
        console.log(error)
        Alert.alert(presenter.internalError())
    }
}

const ForgotPasswordScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const [code, onChangeCode] = useState("")

    return (
        <View style={styles.empty}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <View>
                    <Text style={styles.verificationHeader}>
                        {texts.Screens.Verification}
                    </Text>

                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeCode}
                        value={code}
                        placeholder={texts.Global.Common.Code}
                        placeholderTextColor="white"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            resend(props).then()
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>{texts.Global.Common.ResendCode}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            emailSubmit(code, props).then()
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>{texts.Global.Common.Submit}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default ForgotPasswordScreen;
