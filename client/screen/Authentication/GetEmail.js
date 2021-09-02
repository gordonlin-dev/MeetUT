import React, {useState, useEffect} from 'react'
import {View, Text, BackHandler, TextInput, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from '../styles';
const presenter = require('../Presenter')
const cfg = require('../cfg.json')
const image = require('../../assets/bg.png');
const handler = require('../Handler')
const fixer = require('../Fixer')

const secureStore = require('../../SecureStore')


const emailSubmit = async (email, props) => {
    try {
        email = fixer.email(email)
        const url = cfg.domain + cfg.forgotPasswordResend;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: email,
            })
        });

        if (response.status === 201) {
            await secureStore.Save('UserId', email)
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
                        Verification
                    </Text>
                    <View style={styles.pickerHeader}>
                        <Text style={[styles.quizFont, {color: "white"}]}>Please Enter your email:</Text>
                    </View>
                    
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeEmail}
                        value={email}
                        placeholder="email"
                        placeholderTextColor="white"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            emailSubmit(email, props)
                        }}
                        style={styles.Button}>
                        <Text style={styles.font}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default GetEmailScreen;
