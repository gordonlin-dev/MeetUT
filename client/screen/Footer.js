import React, {useState} from 'react'
import {View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from './styles';
import {NavigationActions, StackActions} from "react-navigation";

const home =  require('../assets/home-icon.png');
const setting =  require('../assets/setting-icon.png');
const chat =  require('../assets/chat-icon.png');

const Footer = props => {
    return (
        <View style={styles.footer}>
            <View style={styles.footerButton}>
            <TouchableOpacity onPress={() => {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Setting' })],
                });
                props.navigation.dispatch(resetAction)
                }}>
                <Image style={styles.icon} source={setting}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                });
                props.navigation.dispatch(resetAction)
                }}>
                <Image style={styles.icon} source={home}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'ChatList' })],
                });
                props.navigation.dispatch(resetAction)
                }}>
                <Image style={styles.icon} source={chat}/>
            </TouchableOpacity>

            </View>

        </View>
    )
};
export default Footer;
