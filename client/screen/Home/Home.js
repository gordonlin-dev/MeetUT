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
import avatars from '../../Avatars'
const lookups = require("../Lookups.json")

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
const {height, width} = Dimensions.get('window');
import { Card } from 'react-native-elements'

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
            let excluded
            if(responseJson.matched){
                excluded = []
                for (const key in responseJson.matched) {
                    excluded.push(key)
                }
                for (const key in responseJson.dismissed){
                    excluded.push(key)
                }
            }else{
                excluded = []
            }
            const body = {
                ExcludedUsers: excluded
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

    const getAvatarSource = (id) =>{
        return avatars.filter(x => x.id === id)[0].source
    }

    const dismissUser = async (id) => {
        setIsLoading(true)
        const response = await handler.sendRequest(
            endpoints.Server.User.User.DismissUser,
            texts.HTTP.Post,
            {dismissedId: id},
            false,
            props
        )
        if(response.ok){
            setIsLoading(false)
            setRecommendations(recommendations.filter(x => x.email !== id))
        }
    }
    const renderGoalsCard = (recommendation) => {
        if(recommendation.reason.length > 0){
            return(
                <Card containerStyle={{
                    borderRadius:15
                }}>
                    <Card.Title style={{
                        fontFamily: 'timeburner',
                        fontSize:25,
                        fontWeight:"bold",
                        color:'rgb(0,41,93)'
                    }}>Goals</Card.Title>
                    <Card.Divider/>
                    <View>
                        {recommendation.reason.map((reason) =>{
                            return(
                                <Text style={{
                                    color: '#000',
                                    fontSize: 16,
                                    marginBottom:height * 0.02
                                }} key={reason.id}>
                                    {reason.value}
                                </Text>
                            )
                        })}
                    </View>
                </Card>
            )
        }
    }
    const renderProgramOfStudy = (recommendation) => {
        if(recommendation.programs.length > 0){
            return(
                <Fragment>
                    <Text style={{
                        color: '#000',
                        fontSize: 16,
                        marginBottom:height * 0.02,
                        fontWeight:"bold"
                    }}>{" Program of Study:"}</Text>
                    <View style={{
                        alignSelf:"center"
                    }}>
                        {recommendation.programs.map((program)=>{
                            return(
                                <Text style={{
                                    color: '#000',
                                    fontSize: 16,
                                    marginBottom:height * 0.02
                                }} key={program.id}>
                                    {" " + program.value}
                                </Text>
                            )
                        })}
                    </View>
                </Fragment>
            )
        }
    }
    const renderProgramCard = (recommendation) => {
        if(recommendation){
            return(
                <Card containerStyle={{
                    borderRadius:15
                }}>
                    <Card.Title style={{
                        fontFamily: 'timeburner',
                        fontSize:25,
                        fontWeight:"bold",
                        color:'rgb(0,41,93)'
                    }}>Program</Card.Title>
                    <Card.Divider/>
                    <View style={{alignItems:"flex-start"}}>
                        <Text style={{
                            color: '#000',
                            fontSize: 16,
                            marginBottom:height * 0.02
                        }}> {getDegreeTypeValue(recommendation.degreeType)} (Year {getYearOfStudyValue(recommendation.yearOfStudy)}) </Text>
                        <Text style={{
                            color: '#000',
                            fontSize: 16,
                            marginBottom:height * 0.02
                        }}> {getCollege(recommendation.college)} </Text>
                        {renderProgramOfStudy(recommendation)}
                    </View>
                </Card>
            )
        }
    }

    const renderHobbiesCard = (recommendation) => {
        if(recommendation.hobbies.length > 0){
            return(
                <Card containerStyle={{
                    borderRadius:15
                }}>
                    <Card.Title style={{
                        fontFamily: 'timeburner',
                        fontSize:25,
                        fontWeight:"bold",
                        color:'rgb(0,41,93)'
                    }}>Interests</Card.Title>
                    <Card.Divider/>
                    <View style={{alignItems:"flex-start"}}>
                        <View style={{
                        }}>
                            {recommendation.hobbies.map((hobby)=>{
                                return(
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 16,
                                        marginBottom:height * 0.02
                                    }} key={hobby.id}>
                                        {" " + hobby.value}
                                    </Text>
                                )
                            })}
                        </View>
                    </View>
                </Card>)
        }
    }
    const renderProjectsCard = (recommendation) => {
        if(recommendation.projectInterests.length > 0){
            return(
                <Card containerStyle={{
                    borderRadius:15
                }}>
                    <Card.Title style={{
                        fontFamily: 'timeburner',
                        fontSize:25,
                        fontWeight:"bold",
                        color:'rgb(0,41,93)'
                    }}>Projects</Card.Title>
                    <Card.Divider/>
                    <View style={{alignItems:"flex-start"}}>
                        <View style={{
                        }}>
                            {recommendation.projectInterests.map((item)=>{
                                return(
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 16,
                                        marginBottom:height * 0.02
                                    }} key={item.id}>
                                        {" " + item.value}
                                    </Text>
                                )
                            })}
                        </View>
                    </View>
                </Card>
            )
        }
    }
    const renderExperienceCard = (recommendation) => {
        if(recommendation.industryExperiences.length > 0){
            return(
                <Card containerStyle={{
                    borderRadius:15
                }}>
                    <Card.Title style={{
                        fontFamily: 'timeburner',
                        fontSize:25,
                        fontWeight:"bold",
                        color:'rgb(0,41,93)'
                    }}>Experience</Card.Title>
                    <Card.Divider/>
                    <View style={{alignItems:"flex-start"}}>
                        <View style={{
                        }}>
                            {recommendation.industryExperiences.map((item)=>{
                                return(
                                    <Text style={{
                                        color: '#000',
                                        fontSize: 16,
                                        marginBottom:height * 0.02
                                    }} key={item.id}>
                                        {" " + item.value}
                                    </Text>
                                )
                            })}
                        </View>
                    </View>
                </Card>
            )
        }
    }

    const renderLanguage = (recommendation) => {
        if(recommendation.languages.length > 0){
            return(
                <Fragment>
                    <Text style={{
                        color: '#000',
                        fontSize: 16,
                        marginBottom:height * 0.02,
                        fontWeight:"bold"
                    }}>{" Languages:"}</Text>
                    <View style={{
                        alignSelf:"center"
                    }}>
                        {recommendation.languages.map((item)=>{
                            return(
                                <Text style={{
                                    color: '#000',
                                    fontSize: 16,
                                    marginBottom:height * 0.02
                                }} key={item.id}>
                                    {" " + item.value}
                                </Text>
                            )
                        })}
                    </View>
                </Fragment>
            )
        }
    }
    const renderPlaces = (recommendation) => {
        if(recommendation.countries.length > 0){
            return(
                <Fragment>
                    <Text style={{
                        color: '#000',
                        fontSize: 16,
                        marginBottom:height * 0.02,
                        fontWeight:"bold"
                    }}>{" Has lived in:"}</Text>
                    <View style={{
                        alignSelf:"center"
                    }}>
                        {recommendation.languages.map((item)=>{
                            return(
                                <Text
                                    style={{
                                        color: '#000',
                                        fontSize: 16,
                                        opacity:0,
                                        height:0
                                    }} key={item.id}>
                                    {" " + item.value}
                                </Text>
                            )
                        })}
                        {recommendation.countries.map((item)=>{
                            return(
                                <Text style={{
                                    color: '#000',
                                    fontSize: 16,
                                    marginBottom:height * 0.02
                                }} key={item.id}>
                                    {" " + item.value}
                                </Text>
                            )
                        })}
                    </View>
                </Fragment>
            )
        }
    }
    const renderPersonalCard = (recommendation) => {
        if(recommendation.languages.length > 0 || recommendation.countries.length > 0){
            return(
                <Card containerStyle={{
                    borderRadius:15
                }}>
                    <Card.Title style={{
                        fontFamily: 'timeburner',
                        fontSize:25,
                        fontWeight:"bold",
                        color:'rgb(0,41,93)'
                    }}>Personal Details</Card.Title>
                    <Card.Divider/>
                    <View style={{}}>
                        {renderLanguage(recommendation)}
                        {renderPlaces(recommendation)}
                    </View>
                </Card>
            )
        }
    }
    const renderProfileCard = (recommendation) => {
        return(
            <ScrollView contentContainerStyle={inpageStyle.slide}>
                <View style={inpageStyle.infoContainer}>
                    <Image style={inpageStyle.avatar} source={getAvatarSource(recommendation.avatar)}/>
                    <View style={{
                        alignItems:"center"
                    }}>
                        <Text style={inpageStyle.name}> {recommendation.name}</Text>
                    </View>
                    <View style={inpageStyle.buttonContainer}>
                        <TouchableOpacity style={inpageStyle.homeButton} onPress={() =>{connect(recommendation.email)}}>
                            <Text style={inpageStyle.buttonFont}>Connect</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={inpageStyle.dismissButton} onPress={() =>{dismissUser(recommendation.email)}}>
                            <Text style={inpageStyle.dismissFont}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={inpageStyle.detailContainer}>
                    {renderGoalsCard(recommendation)}
                    {renderProgramCard(recommendation)}
                    {renderHobbiesCard(recommendation)}
                    {renderProjectsCard(recommendation)}
                    {renderExperienceCard(recommendation)}
                    {renderPersonalCard(recommendation)}
                </View>
                <View style={{backgroundColor:"#d2d2d2"}}>
                    <View style={inpageStyle.buttonContainer}>
                        <TouchableOpacity style={inpageStyle.homeButton} onPress={() =>{connect(recommendation.email)}}>
                            <Text style={inpageStyle.buttonFont}>Connect</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={inpageStyle.dismissButton} onPress={() =>{dismissUser(recommendation.email)}}>
                            <Text style={inpageStyle.dismissFont}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
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
        <SafeAreaView style={inpageStyle.container}>
            <View style={inpageStyle.flex9}>
                <Swiper style={{}} loop={false}
                        key={recommendations.length}
                        showsPagination={false}
                        showsButtons={true}
                        nextButton={<Text style={{color:'rgb(0,41,93)', fontSize:50}}>›</Text>}
                        prevButton={<Text style={{color:'rgb(0,41,93)', fontSize:50}}>‹</Text>}
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
            {renderLoadingIcon()}
            <View style={inpageStyle.flex1}>
            </View>
            <Footer navigation={props.navigation} isLoading={isLoading}/>
        </SafeAreaView>
    )
}


const inpageStyle = StyleSheet.create({
    avatar: {
        marginTop: height*0.04,
        height: height*0.25,
        width: height*0.25,
        borderRadius: height*0.25/ 2,
        borderColor:'white',
        borderWidth:3
    },
    name: {
        color: 'white',
        fontSize: 35,
        marginTop:height * 0.03,
        fontWeight: 'bold'
    },
    flex9:{
        flex:14
    },
    flex1:{
        flex:1,
        backgroundColor:'#d2d2d2'
    },
    slide: {
        backgroundColor: 'white'
    },
    infoContainer: {
        backgroundColor: 'rgb(49,119,183)',
        alignItems: 'center'
    },
    dismissButtonContainer: {
        alignItems: 'center'
    },
    dismissButton: {
        width: width * 0.3,
        height: height * 0.06,
        marginBottom: height * 0.04,
        marginLeft: width * 0.04,
        marginRight: width * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white'
    },
    buttonContainer:{
        marginBottom: height * 0.02,
        marginTop:height * 0.03,
        flexDirection:"row",
        alignSelf:"center"
    },
    homeButton: {
        width: width * 0.3,
        height: height * 0.06,
        marginBottom: height * 0.04,
        marginLeft: width * 0.05,
        marginRight: width * 0.04,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
    },
    detailContainer: {
        paddingBottom: height * 0.01,
        backgroundColor:'#d2d2d2'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonFont: {
        fontFamily: 'timeburner',
        fontSize:17,
        color: 'rgb(0,41,93)'
    },
    dismissFont: {
        fontFamily: 'timeburner',
        fontSize:17,
        color: 'red'
    },
    container:{
        flex:1,
        backgroundColor:'#d2d2d2'
    }
})
export default HomeScreen;
