import React, {useState} from 'react'
import {View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {styles} from './styles';

const home =  require('../assets/home-icon.png');
const setting =  require('../assets/setting-icon.png');
const chat =  require('../assets/chat-icon.png');

const Footer = props => {
    return (
        <View style={styles.footer}>
            <View style={styles.footerButton}>
            <TouchableOpacity onPress={() => {
                    props.navigation.navigate({
                        routeName: 'Setting'
                    })
                }}>
                <Image style={styles.icon} source={setting}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
                <Image style={styles.icon} source={home}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                    props.navigation.navigate({
                        routeName: 'ChatList'
                    })
                }}>
                <Image style={styles.icon} source={chat}/>
            </TouchableOpacity>

            </View>

        </View>
    )
};
export default Footer;