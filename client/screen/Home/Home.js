import React, {useState, useEffect, useRef, Fragment} from 'react'
import {
    View,
    Image,
    StyleSheet,
    Button,
    BackHandler,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Text,
    Alert
} from 'react-native'
import Footer from "../Footer";
import ProfileCard from "./ProfileCard";
import Swiper from 'react-native-swiper';
import { styles } from '../styles';
const home =  require('../../assets/home-icon.png');
const setting =  require('../../assets/setting-icon.png');
const chat =  require('../../assets/chat-icon.png');

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')

const HomeScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const [recommendations, setRecommendations] = useState([])
    const [index, setIndex] = useState(0)

    const loadUser = async () => {
        const matchResponse = await handler.sendRequest(
            endpoints.Server.User.User.baseURL,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if(matchResponse.ok){
            const responseJson = await matchResponse.json();
            let matched
            if(responseJson.matched){
                matched = responseJson.matched
            }else{
                matched = []
            }
            const body = {
                excludedUsers: matched
            }
            const response = await handler.sendRequest(
                endpoints.Server.Onboarding.User.Recommendations,
                texts.HTTP.Post,
                body,
                true,
                props
            )
            if(response.status === 403){
                Alert.alert(texts.Alert.Title.CompleteSignUp,
                    "",
                    [{text: texts.Alert.Buttons.OK, onPress: () => props.navigation.navigate({
                            routeName: "Demographics"
                        })}])
            }else if(response.ok){
                const responseJson = await response.json();
                console.log(responseJson)
                setRecommendations(responseJson)
            }
        }
    }

    useEffect(() => {
        loadUser()
    }, []);

    const renderSwiper = () => {
        return(
            <Fragment>

                <View>
                    <Text>1234</Text>
                </View>

                <View>
                    <Text>4321</Text>
                </View>
            </Fragment>
        )
    }
    return(
        <SafeAreaView style={styles.container}>
            <View style={inpageStyles.flex3}>
                <Swiper style={{}} loop={false}
                        showsPagination={true}
                        index={index}
                        dot={
                            <View
                                style={{
                                    backgroundColor: 'rgba(0,0,0,.3)',
                                    width: 10,
                                    height: 10,
                                    borderRadius: 7,
                                    marginLeft: 7,
                                    marginRight: 7
                                }}
                            />
                        }
                        activeDot={
                            <View
                                style={{
                                    backgroundColor: '#000',
                                    width: 10,
                                    height: 10,
                                    borderRadius: 7,
                                    marginLeft: 7,
                                    marginRight: 7
                                }}
                            />}
                >
                    {recommendations.map((recommendation, i) => {return renderSwiper()})}
                </Swiper>
            </View>
            <View style={inpageStyles.flex1}>
                <Footer navigation={props.navigation}/>
            </View>
        </SafeAreaView>
    )
}

const inpageStyles = StyleSheet.create(
    {
        flex3:{
            flex:9
        },
        flex1:{
            flex:1
        }
    }
)
export default HomeScreen;
