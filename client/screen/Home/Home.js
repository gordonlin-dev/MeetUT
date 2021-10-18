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
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import Footer from "../Footer";
import Swiper from 'react-native-swiper';
import { styles } from '../styles';
import logo from "../../assets/logo.png";
const lookups = require("../Lookups.json")

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
const {height, width} = Dimensions.get('window');

const HomeScreen = props => {
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const [recommendations, setRecommendations] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const loadUser = async () => {
        setIsLoading(true)
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
                matched = []
                for (const key in responseJson.matched) {
                    matched.push(key)
                }
            }else{
                matched = []
            }
            const body = {
                ExcludedUsers: matched
            }
            const response = await handler.sendRequest(
                endpoints.Server.Onboarding.User.Recommendations,
                texts.HTTP.Post,
                body,
                true,
                props
            )
            if(response.status === 403){
                setIsLoading(false)
                Alert.alert(texts.Alert.Title.CompleteSignUp,
                    "",
                    [{text: texts.Alert.Buttons.OK, onPress: () => props.navigation.navigate({
                            routeName: "Demographics"
                        })}])
            }else if(response.ok){
                setIsLoading(false)
                const responseJson = await response.json();
                setRecommendations(responseJson)
            }

        }
    }
    const connect = async (email) => {
        setIsLoading(true)
        const response = await handler.sendRequest(
            endpoints.Server.User.Match.Like,
            texts.HTTP.Post,
            {likedUser: email},
            false,
            props
        )
        if(response.ok){
            setIsLoading(false)
            setRecommendations(recommendations.filter(x => x.email !== email))
        }
    }
    const getDegreeTypeValue = (value) => {
        for (const key in lookups.Academic.DegreeType) {
            if(lookups.Academic.DegreeType[key].Value == value){
                return lookups.Academic.DegreeType[key].DisplayValue
            }
        }
    }

    const getYearOfStudyValue = (value) => {
        for (const key in lookups.Academic.YearOfStudy) {
            if(lookups.Academic.YearOfStudy[key].Value == value){
                return lookups.Academic.YearOfStudy[key].DisplayValue
            }
        }
    }

    const getCollege = (value) => {
        for (const key in lookups.Academic.College) {
            if(lookups.Academic.College[key].Value == value){
                return lookups.Academic.College[key].DisplayValue
            }
        }
    }
    useEffect(() => {
        loadUser()
    }, []);

    const renderProfileCard = (recommendation) => {
        return(
            <ScrollView contentContainerStyle={inpageStyle.slide}>
                <View style={inpageStyle.infoContainer}>
                    <Image style={styles.avatar} source={logo}/>
                    <View >
                        <Text style={styles.text}> {recommendation.name}</Text>
                        <Text style={styles.text}> Wants to</Text>
                        {recommendation.reason.map((reason) =>{
                            return(
                                <Text style={styles.quizFont} key={reason.id}>
                                    {reason.value}
                                </Text>
                            )
                        })}
                    </View>

                    <View style={inpageStyle.buttonContainer}>
                        <TouchableOpacity style={inpageStyle.homeButton} onPress={() =>{connect(recommendation.email)}}>
                            <Text style={styles.quizFont}>Connect</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={inpageStyle.detailContainer}>
                    <Text style={styles.text}> {getDegreeTypeValue(recommendation.degreeType)} </Text>
                    <Text style={styles.text}> Year: {getYearOfStudyValue(recommendation.yearOfStudy)} </Text>
                    <Text style={styles.text}> {getCollege(recommendation.college)} </Text>
                    <Text style={styles.text}> Program(s) </Text>
                    {recommendation.programs.map((program)=>{
                        return(
                            <Text style={styles.quizFont} key={program.id}>
                                {program.value}
                            </Text>
                        )
                    })}
                    <Text style={styles.text}> Industry Experiences </Text>
                    {recommendation.industryExperiences.map((exp) =>{
                        return(
                            <Text style={styles.quizFont} key={exp.id}>
                                {exp.value}
                            </Text>
                        )
                    })}
                    <Text style={styles.text}> Project Interests </Text>
                    {recommendation.projectInterests.map((project) => {
                        return(
                            <Text style={styles.quizFont} key={project.id}>
                                {project.value}
                            </Text>
                        )
                    })}
                    <Text style={styles.text}>Languages</Text>
                    {recommendation.languages.map((language) => {
                        return(
                            <Text style={styles.quizFont} key={language.id}>
                                {language.value}
                            </Text>
                        )
                    })}
                    <Text style={styles.text}>Has lived in</Text>
                    {recommendation.countries.map((country) => {
                        return(
                            <Text style={styles.quizFont} key={country.id}>
                                {country.value}
                            </Text>
                        )
                    })}
                </View>
            </ScrollView>
        )
    }

    const renderLoadingIcon = () => {
        if(isLoading){
            return(
                <ActivityIndicator size="large" style={styles.loading} color="#0000ff" />
            )
        }
    }
    return(
        <SafeAreaView style={styles.container}>
            <View style={inpageStyle.flex9}>
                <Swiper style={{}} loop={false}
                        key={recommendations.length}
                        showsPagination={true}
                        showsButtons={true}
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
                    {recommendations.map((recommendation) => {
                        return(
                            <View key={recommendation.userId}>
                                {renderProfileCard(recommendation)}
                            </View>
                        )
                    })}
                </Swiper>
            </View>

            <View style={inpageStyle.flex1}>
                <Footer navigation={props.navigation} isLoading={isLoading}/>
            </View>
            {renderLoadingIcon()}
        </SafeAreaView>
    )
}


const inpageStyle = StyleSheet.create({
    flex9:{
        flex:9
    },
    flex1:{
        flex:1
    },
    slide: {
        backgroundColor: 'white'
    },
    infoContainer: {
        backgroundColor: '#9DD6EB',
        alignItems: 'center'
    },
    buttonContainer:{
        marginTop: height * 0.02,
        marginBottom: height * 0.02
    },
    homeButton: {
        width: width * 0.4,
        height: height * 0.06,
        marginBottom: height * 0.04,
        marginLeft: width * 0.05,
        marginRight: width * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
    },
    detailContainer: {
        paddingBottom: height * 0.1,
        left: width * 0.03,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default HomeScreen;
