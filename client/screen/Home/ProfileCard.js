import React, {useState, useEffect} from 'react'
import {View, Text, Button, StyleSheet, Image, Dimensions, ImageBackground} from 'react-native'
import logo from '../../assets/logo.png'


const secureStore = require('../../SecureStore')
const {height, width} = Dimensions.get('window');

const ProfileCard = props => {

    return(
        <View>
            <ImageBackground source={logo}style={styles.profilebg} >
            <Text>
                {props.firstName + ' ' + props.lastName}
            </Text>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    profilebg: {
        marginTop: height * 0.05,
        marginBottom: height * 0.08,
        marginLeft: width * 0.1,
        height: height * 0.6,
        width: width * 0.8
    }
})
export default ProfileCard
