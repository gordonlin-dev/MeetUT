import React, {useState} from 'react'
import {View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from './styles';
import {NavigationActions, StackActions} from "react-navigation";

const home =  require('../assets/home-icon.png');
const setting =  require('../assets/setting-icon.png');
const chat =  require('../assets/chat-icon.png');
const {height, width} = Dimensions.get('window');
const Footer = props => {
    return (
        <View style={{
            position: "absolute",
            justifyContent: 'space-between',
            alignItems: 'stretch',
            backgroundColor: 'rgb(0,41,93)',
            height: height * 0.1,
            width: width,
            bottom: 0
        }}>
            <View style={styles.footerButton}>

            <TouchableOpacity onPress={() => {
                if(!props.isLoading){
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Home' })],
                    });
                    props.navigation.dispatch(resetAction)
                }
                }}>
                <Image style={styles.icon} source={home}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                if(!props.isLoading){
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'ChatList' })],
                    });
                    props.navigation.dispatch(resetAction)
                }
                }}>
                <Image style={styles.icon} source={chat}/>
            </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if(!props.isLoading){
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Setting' })],
                        });
                        props.navigation.dispatch(resetAction)
                    }
                }}>
                    <Image style={styles.icon} source={setting}/>
                </TouchableOpacity>
            </View>

        </View>
    )
};
export default Footer;
