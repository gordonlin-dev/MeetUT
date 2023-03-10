import React, {useEffect, useState} from 'react'
import {
    View,
    Text,
    Image,
    BackHandler,
    FlatList,
    TouchableOpacity,
    Dimensions, StyleSheet, ActivityIndicator
} from 'react-native'
import {styles} from '../styles';

const texts = require("../../assets/Texts.json");
import avatars from '../../Avatars'
import {NavigationActions, StackActions} from "react-navigation";

const {height, width} = Dimensions.get('window')
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
const ChangeAvatarScreen = props => {
    useEffect(() => {
        getProfile()
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])
    const [selectedAvatar, setSelectedAvatar] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const selectAvatar = (id) => {
        setSelectedAvatar(id)
    }
    const renderLoadingIcon = () => {
        if(isLoading){
            return(
                <ActivityIndicator size="large" style={styles.loading} color="#0000ff" />
            )
        }
    }
    const getProfile = async () => {
        setIsLoading(true)
        const response = await handler.sendRequest(
            endpoints.Server.User.User.baseURL,
            texts.HTTP.Get,
            {},
            false,
            props
        )

        if (response.ok) {
            setIsLoading(false)
            const responseJson = await response.json();
            if (typeof responseJson.avatar !== 'undefined') {
                setSelectedAvatar(responseJson.avatar)
            }
        }
    }

    const save = async() => {
        setIsLoading(true)
        const response = await handler.sendRequest(
            endpoints.Server.User.User.SetAvatar,
            texts.HTTP.Put,
            {avatar: selectedAvatar},
            false,
            props
        )
        if(response.ok){
            setIsLoading(false)
        }
    }
    const renderItem = ({item}) => {
        if(item.id === selectedAvatar){
            return(
                <TouchableOpacity onPress={() => {
                    selectAvatar(item.id)
                }}>
                    <Image key={item.id} source={item.source} style={inpageStyle.selectedAvatar}/>
                </TouchableOpacity>
            )
        }else{
            return(
                <TouchableOpacity onPress={() => {
                    selectAvatar(item.id)
                }}>
                    <Image key={item.id} source={item.source} style={{
                        marginTop: height*0.01,
                        marginLeft: width*0.01,
                        height: width*0.3,
                        width: width*0.3,
                        borderRadius: width*0.3/ 2,
                    }}/>
                </TouchableOpacity>
            )
        }
    }

    return (
        <View style={styles.onboardContainer}>
            <View style={{marginLeft: width * 0.03, marginTop: height * 0.02}}>
                <FlatList
                    data={avatars}
                    numColumns={3}
                    renderItem={renderItem}
                />
            </View>
            <View style={inpageStyle.quizeFooter}>
                <TouchableOpacity
                    style={styles.quizRightButton}
                    onPress={()=>{save()}}
                >
                    <Text style={styles.quizFont}>{texts.Screens.Demographics.Buttons.Save}</Text>
                </TouchableOpacity>
            </View>

            {renderLoadingIcon()}
        </View>
    );
};
const inpageStyle = StyleSheet.create({
    selectedAvatar: {
        marginTop: height*0.01,
        marginLeft: width*0.01,
        height: width*0.3,
        width: width*0.3,
        borderRadius: width*0.3/ 2,
        borderWidth:6,
        borderColor:"green"
    },
    quizeFooter: {
        marginTop: height*0.03,
        flexDirection:"row",
        alignSelf:"center",
        position: "absolute",
        bottom: 0,
        marginBottom: height * 0.02
    }
});
export default ChangeAvatarScreen;
