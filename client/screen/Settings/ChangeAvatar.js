import React, {useEffect} from 'react'
import {
    View,
    Text,
    Image,
    BackHandler,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import {styles} from '../styles';

const texts = require("../../assets/Texts.json");
import avatars from '../../Avatars'

const {height, width} = Dimensions.get('window')
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
const ChangeAvatarScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    const selectAvatar = async (id) => {
        await handler.sendRequest(
            endpoints.Server.User.User.SetAvatar,
            texts.HTTP.Put,
            {avatar: id},
            false,
            props
        )
    }
    const renderItem = ({item}) => (
        <TouchableOpacity onPress={() => {
            selectAvatar(item.id).then()
        }}>
            <Image key={item.id} source={item.source} style={styles.changeAvatar}/>
        </TouchableOpacity>

    );

    return (
        <View style={styles.onboardContainer}>
            <View style={{marginLeft: width * 0.03, marginTop: height * 0.02}}>
                <FlatList
                    data={avatars}
                    numColumns={3}
                    renderItem={renderItem}
                />
            </View>
            <TouchableOpacity
                style={styles.quizRightButton}>
                <Text style={styles.quizFont}>{texts.Screens.Demographics.Buttons.Save}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChangeAvatarScreen;