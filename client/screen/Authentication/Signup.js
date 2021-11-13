import React, {useState, useEffect} from 'react'
import {
    Text,
    BackHandler,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView, ScrollView, StyleSheet, Dimensions, ActivityIndicator, View
} from 'react-native'
import {useHeaderHeight} from 'react-navigation-stack';
import { Icon } from 'react-native-elements'
import {styles} from '../styles';
import AsyncStorage from "@react-native-async-storage/async-storage";

const image = require('../../assets/bg.png');
const handler = require('../Handler')
const fixer = require('../Fixer')
const endpoints = require('../../API_endpoints.json')
const texts = require("../../assets/Texts.json");
const {height, width} = Dimensions.get('window');



const SignupScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const [email, onChangeEmail] = useState("");
    const [password, onChangePassword] = useState("");
    const [confirm, onChangeNumber] = useState("");
    const [firstName, onChangeFirstName] = useState("");
    const [lastName, onChangeLastName] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const renderLoadingIcon = () => {
        if(isLoading){
            return(
                <ActivityIndicator size="large" style={styles.loading} color="#ffffff" />
            )
        }
    }
    const signupSubmit = async (firstName, lastName, email, password, confirm, props) => {
        try {
            setIsLoading(true)
            if(!isLoading){
                const body = {
                    firstName: firstName,
                    lastName: lastName,
                    _id: fixer.email(email),
                    password: password,
                    confirm: confirm
                }
                const response = await handler.sendRequest(
                    endpoints.Server.User.User.SignUp,
                    texts.HTTP.Post,
                    body,
                    true,
                    props
                )
                if (response.status == 403) {
                    const responseJson = await response.json();
                    setIsLoading(false)
                    await AsyncStorage.setItem('accessToken', responseJson.accessToken)
                    props.navigation.navigate({
                        routeName: 'Verification'
                    })
                } else {
                    setIsLoading(false)
                    await handler.handleResponse(response, props)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <ImageBackground source={image}  defaultSource={image} resizeMode="cover" style={styles.image}>
            <ScrollView>
                <KeyboardAvoidingView  style={{paddingTop: height*0.05}} behavior={"padding"} keyboardVerticalOffset = {useHeaderHeight()}>
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

                    <Text style={inpageStyle.signUpHeader}>
                        {texts.Global.Common.SignUp}
                    </Text>
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeFirstName}
                        value={firstName}
                        placeholder= {texts.Global.Common.Firstname}
                        placeholderTextColor="white"
                    />
                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeLastName}
                        value={lastName}
                        placeholder={texts.Global.Common.Lastname}
                        placeholderTextColor="white"
                    />
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

                    <TextInput
                        style={styles.Input}
                        onChangeText={onChangeNumber}
                        value={confirm}
                        secureTextEntry={true}
                        placeholder={texts.Global.Common.ConfirmPassword}
                        placeholderTextColor="white"
                    />
                    <TouchableOpacity
                        onPress={async () => {
                            await signupSubmit(firstName, lastName, email, password, confirm, props)
                        }}
                        style={inpageStyle.Button}>
                        <Text style={styles.font}>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
            {renderLoadingIcon()}
        </ImageBackground>
    );
};
const inpageStyle = StyleSheet.create({
    signUpHeader: {
        fontSize: 50,
        marginLeft: width * 0.27,
        marginTop : height * 0.06,
        marginBottom: height * 0.03,
        color: "white",
        fontFamily: 'timeburner',
    },
    Button: {
        width: width * 0.6,
        height: height * 0.06,
        marginTop: height * 0.04,
        marginBottom: height * 0.04,
        marginLeft: width * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
    }
})
export default SignupScreen;
