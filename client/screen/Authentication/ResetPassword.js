import React, {useState, useEffect} from 'react'
import {
    View,
    Text,
    BackHandler,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    ActivityIndicator
} from 'react-native'
import {styles} from '../styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NavigationActions, StackActions} from "react-navigation";
import {Icon} from "react-native-elements";
const {height, width} = Dimensions.get('window');
const image = require('../../assets/bg.png');
const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')



const ResetPasswordScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    const [password, onChangePassword] = useState("");
    const [confirm, onChangeNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const renderLoadingIcon = () => {
        if(isLoading){
            return(
                <ActivityIndicator size="large" style={styles.loading} color="#ffffff" />
            )
        }
    }
    const resetSubmit = async (password, confirm, props) => {
        setIsLoading(true)
        const body = {
            password: password,
            confirm: confirm
        }
        const response = await handler.sendRequest(
            endpoints.Server.User.User.ResetPassword,
            texts.HTTP.Put,
            body,
            false,
            props
        )
        if(response.ok){
            setIsLoading(false)
            const responseJson = await response.json();
            await AsyncStorage.setItem('accessToken', responseJson.accessToken)
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })],
            });
            props.navigation.dispatch(resetAction)
        }
        setIsLoading(false)
    }
    return (
        <View style={styles.empty}>
            <View style={{
                alignItems:"flex-start",
                paddingTop: height * 0.04,
                backgroundColor:"rgb(60,116,185)"
            }}>
                <Icon name="chevron-left" size={35} color="white" type="fontawesome5" style={{
                    marginLeft:width*0.02
                }}
                      onPress={()=>{
                          props.navigation.navigate({
                              routeName: 'Setting'
                          })
                      }}
                />
            </View>
            <ImageBackground source={image} defaultSource={image} resizeMode="cover" style={styles.image}>

                <View>
                    <Text style={[styles.header, {fontSize: 41, marginLeft: width*0.12}]}>
                        Reset Password
                    </Text>
                    <View>
                        <TextInput
                            style={styles.Input}
                            onChangeText={onChangePassword}
                            value={password}
                            secureTextEntry={true}
                            placeholder= {texts.Screens.ResetPassword.NewPassword}
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
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                resetSubmit(password, confirm, props).then()
                            }}
                            style={styles.Button}>
                            <Text style={styles.font}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {renderLoadingIcon()}
            </ImageBackground>

        </View>


    );
};


export default ResetPasswordScreen;
