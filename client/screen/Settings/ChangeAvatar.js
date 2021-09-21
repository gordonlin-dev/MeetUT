import React, {useState, useEffect} from 'react'
import {
    View,
    Text,
    Image,
    BackHandler,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native'
import {styles} from '../styles';
const texts = require("../../assets/Texts.json");
const avatar = require("../../Avatar")

const {height, width} = Dimensions.get('window')

const ChangeAvatarScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    // TODO: Does not show avatar
    return (
        <View style={styles.onboardContainer}>
            <ScrollView>
                <Image source={{uri:avatar.getAvatar(0)}} style={styles.changeAvatar}/>
            </ScrollView>
            <TouchableOpacity
                style={styles.quizRightButton}>
                <Text style={styles.quizFont}>{texts.Screens.Demographics.Buttons.Save}</Text>
            </TouchableOpacity>
        </View>

    );
};

export default ChangeAvatarScreen;