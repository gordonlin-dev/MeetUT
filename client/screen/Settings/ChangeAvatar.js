import React, {useState, useEffect} from 'react'
import {
    View,
    Text,
    Image,
    BackHandler,
    FlatList,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native'
import {styles} from '../styles';
const texts = require("../../assets/Texts.json");
import avatars from '../../Avatars'
const {height, width} = Dimensions.get('window')

const ChangeAvatarScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const renderItem = ({ item }) => (
        <Image key={item.id} source={item.source} style={styles.changeAvatar}/>
    );

    return (
        <View style={styles.onboardContainer}>
            <ScrollView style={{marginLeft: width * 0.03, marginTop: height * 0.02}}>
                <FlatList
                    data={avatars}
                    numColumns={3}
                    renderItem={renderItem}
                />
            </ScrollView>
            <TouchableOpacity
                style={styles.quizRightButton}>
                <Text style={styles.quizFont}>{texts.Screens.Demographics.Buttons.Save}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChangeAvatarScreen;