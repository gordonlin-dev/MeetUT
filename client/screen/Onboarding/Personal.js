import React, {Fragment, useEffect, useState} from 'react'
import {
    View,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Text,
    StyleSheet,
    SectionList,
    TextInput, ActivityIndicator
} from 'react-native'
import {styles} from '../styles'
import {NavigationActions, StackActions} from "react-navigation";
import CheckBox from 'react-native-check-box'
import {Card} from "react-native-elements";
const {height, width} = Dimensions.get('window');
const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
const lookups = require('../Lookups.json')


const Personal = props => {
    const [reasons, setReasons] = useState([]);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [hasIndustryExperience, setHasIndustryExperience] = useState(false);
    const [industryExperience, setIndustryExperience] = useState([]);
    const [selectedIndustryExperience, setSelectedIndustryExperience] = useState([]);
    const [hobbies, setHobbies] = useState([])
    const [selectedHobbies, setSelectedHobbies] = useState([])
    const [countries, setCountries] = useState([])
    const [selectedCountries, setSelectedCountries] = useState([])
    const [countriesFiler, setCountriesFilter] = useState("")
    const [renderStage, setRenderStage] = useState(0);
    const [forceUpdate, setForceUpdate] = useState(true);
    const [hobbiesFilter, setHobbiesFilter] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const renderLoadingIcon = () => {
        if(isLoading){
            return(
                <ActivityIndicator size="large" style={styles.loading} color="#0000ff" />
            )
        }
    }
    useEffect(() => {
        getData()
    }, []);

    const getData = async () => {
        setIsLoading(true)
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.Questionnaire.Personal,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if(response.ok){
            setIsLoading(false)
            const responseJson = await response.json()
            setReasons(responseJson.reasonsToJoin)
            setProjects(responseJson.projectInterests)
            setIndustryExperience(responseJson.industryExperiences)
            setCountries(responseJson.countriesLivedIn)
            setHobbies(responseJson.hobbies)
        }
    }

    const save = async () => {
        setIsLoading(true)
        const body = {
            ReasonsToJoin: selectedReasons,
            IndustryExperiences: selectedIndustryExperience,
            CountriesLivedIn: selectedCountries,
            ProjectInterests: selectedProjects,
            SelectedHobbies: selectedHobbies
        }
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.Questionnaire.Personal,
            texts.HTTP.Post,
            body,
            false,
            props
        )
        if(response.ok){
            const response2 = await handler.sendRequest(
                endpoints.Server.Onboarding.User.Compatibility,
                texts.HTTP.Post,
                {},
                false,
                props
            )
            if(response2.ok){
                setIsLoading(false)
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                });
                props.navigation.dispatch(resetAction)
            }
        }
    }
    const generateReasonsSelection = () => {
        let section = {
            title:"",
            data:reasons.sort((a,b) => {return a.id - b.id})
        }
        return [section]
    }

    const reasonSelectPress = (item) => {
        if(selectedReasons.filter(x => x.id === item.id).length === 0){
            selectedReasons.push(item)
            setSelectedReasons(selectedReasons)
        }else{
            setSelectedReasons(selectedReasons.filter(x => x.id !== item.id))
        }
        setForceUpdate(!forceUpdate)
    }

    const generateProjectSelection = () => {
        let section = {
            title:"",
            data:projects.sort((a,b) => {return a.id - b.id})
        }
        return [section]
    }
    const projectSelectPress = (item) => {
        if(selectedProjects.filter(x => x.id === item.id).length === 0){
            selectedProjects.push(item)
            setSelectedProjects(selectedProjects)
        }else{
            setSelectedProjects(selectedProjects.filter(x => x.id !== item.id))
        }
        setForceUpdate(!forceUpdate)
    }

    const generateIndustrySelection = () => {
        let section = {
            title:"",
            data:industryExperience.sort((a,b) => {return a.id - b.id})
        }
        return [section]
    }

    const industrySelectPress = (item) => {
        if(selectedIndustryExperience.filter(x => x.id === item.id).length === 0){
            if(selectedIndustryExperience.length < 3){
                selectedIndustryExperience.push(item)
                setSelectedIndustryExperience(selectedIndustryExperience)
            }
        }else{
            setSelectedIndustryExperience(selectedIndustryExperience.filter(x => x.id !== item.id))
        }
        setForceUpdate(!forceUpdate)
    }

    const generateCountrySelection = () => {
        const notSelectedCountries = countries.filter(x =>
            (selectedCountries.indexOf(x) === -1) &&
            (x.value.includes(countriesFiler))
        )
        let selectedSection = {
            title:"",
            data:selectedCountries.sort((a,b) => {return a.value > b.value})
        }
        let section = {
            title:"",
            data:notSelectedCountries.sort((a,b) => {return a.value > b.value})
        }
        return [selectedSection,section]
    }

    const generateHobbiesSelection = () => {
        let sections = []
        for (let i = 0; i < hobbies.length; i++){
            let section = {
                title:hobbies[i].categoryValue,
                data:hobbies[i].content.sort((a,b) => {return a.value > b.value})
            }
            section.data = section.data.filter(x => x.value.includes(hobbiesFilter))
            if(section.data.length > 0){
                sections.push(section)
            }
        }
        return sections
    }

    const generateSelectedHobbies = () => {
        let section = {
            title:"Selected",
            data:selectedHobbies
        }
        return [section]
    }

    const hobbiesPress = (hobby) => {
        const filtered = selectedHobbies.filter(element => element.hobbyId === hobby.hobbyId)
        if(filtered.length === 0){
            selectedHobbies.push(hobby)
            setSelectedHobbies(selectedHobbies)
            removeHobby(hobby.hobbyId)
            setForceUpdate(!forceUpdate)
        }
    }
    const selectedHobbiesPress = (hobby) => {
        setSelectedHobbies(selectedHobbies.filter(element => element.hobbyId !== hobby.hobbyId))
        addHobby(hobby)
        setForceUpdate(!forceUpdate)
    }

    const removeHobby = (hobbyId) =>{
        for(let i = 0; i < hobbies.length; i++){
            hobbies[i].content = hobbies[i].content.filter(element => element.hobbyId !== hobbyId)
        }
        setHobbies(hobbies)
    }

    const addHobby = (hobby) => {
        for(let i = 0; i < hobbies.length; i ++){
            if(hobby.categoryIds.filter(element => element === hobbies[i].categoryId).length > 0){
                if(hobbies[i].content.filter(element => element.hobbyId === hobby.hobbyId).length === 0){
                    hobbies[i].content.push(hobby)
                    hobbies[i].content.sort((a,b) => {return a.value > b.value})
                }
            }
        }
        setHobbies(hobbies)
    }

    const countrySelectPress = (item) => {
        if(selectedCountries.filter(x => x.id === item.id).length === 0){
            selectedCountries.push(item)
            setSelectedCountries(selectedCountries)
        }else{
            setSelectedCountries(selectedCountries.filter(x => x.id !== item.id))
        }
        setForceUpdate(!forceUpdate)
    }

    const getReasonItemStyle = (item) =>{
        if(selectedReasons.filter(x => x.id === item.id).length === 0){
            return inpageStyle.item
        }else{
            return inpageStyle.itemSelected
        }
    }
    const getProjectItemStyle = (item) => {
        if(selectedProjects.filter(x => x.id === item.id).length === 0){
            return {marginBottom:3,
                fontSize: 18,
                height: 44,
                color: 'rgba(0,0,0,1.0)',
            }
        }else{
            return {
                marginBottom:3,
                fontSize: 18,
                height: 44,
                color: 'rgba(0,0,0,1.0)',
                borderColor:"rgb(0,41,93)",
                borderWidth:2,
            }
        }
    }

    const getIndustryItemStyle = (item) => {
        if(selectedIndustryExperience.filter(x => x.id === item.id).length === 0){
            return inpageStyle.item
        }else{
            return inpageStyle.itemSelected
        }
    }
    const getCountryItemStyle = (item) => {
        if(selectedCountries.filter(x => x.id === item.id).length === 0){
            return inpageStyle.item
        }else{
            return inpageStyle.itemSelected
        }
    }

    const renderBody = () => {
        if(renderStage === 0){
            return(
                <Fragment>
                    <View style={{
                        flex: 11
                    }}>
                        <View style={{
                            left: width*0.10,
                            width: width * 0.8,
                            marginTop: height * 0.02,
                            marginBottom:height * 0.01
                        }}>
                            <Text style={{
                                fontFamily: 'timeburner',
                                fontSize:20,
                                color: "black"
                            }}>What are your reasons for joining MeetUT?</Text>
                        </View>
                        <View style={{
                            left: width*0.1,
                            width: width * 0.8,
                        }}>
                            <SectionList sections={generateReasonsSelection()}
                                         style={{
                                             width: width * 0.8,
                                         }}
                                         renderItem={({item}) =>
                                            <View style={{
                                                width: width * 0.8
                                            }}>
                                                <Text style={getReasonItemStyle(item)} onPress={() => {
                                                    reasonSelectPress(item)
                                                }}>{item.value}</Text>
                                            </View>
                                         }
                                         keyExtractor={(item, index) => index}
                            >

                            </SectionList>
                        </View>

                        <View style={{
                            left: width*0.10,
                            width: width * 0.8,
                            marginTop: height * 0.02,
                            marginBottom:height * 0.01
                        }}>
                            <Text style={{
                                fontFamily: 'timeburner',
                                fontSize:20,
                                color: "black"
                            }}>Project interests</Text>
                        </View>
                        <SectionList sections={generateProjectSelection()}
                                     style={{
                                         width: width * 0.8,
                                         left: width*0.10,
                                     }}
                                     renderItem={({item}) => <Text style={getProjectItemStyle(item)} onPress={() => {
                                         projectSelectPress(item)
                                     }}>{item.value}</Text>}
                                     keyExtractor={(item, index) => index}
                        >

                        </SectionList>
                    </View>
                </Fragment>
            )
        }else if(renderStage === 1){
            if(hasIndustryExperience){
                return(
                    <Fragment>
                        <View style={{
                            flex:11,
                            marginBottom: height * 0.03
                        }}>
                            <View style={{
                                left: width*0.13,
                                width: width * 0.8,
                                marginTop: height * 0.02,
                                marginBottom:height * 0.01
                            }}>
                                <Text style={{
                                    fontFamily: 'timeburner',
                                    fontSize:20,
                                    color: "black"
                                }}>Industry Experience</Text>
                            </View>
                            <SectionList
                                style={{
                                    width: width * 0.8,
                                    left: width*0.13,
                                }}
                                sections={generateIndustrySelection()}
                                renderItem={({item}) => <Text style={getIndustryItemStyle(item)} onPress={() => {
                                    industrySelectPress(item)
                                }}>{item.value}</Text>}
                                keyExtractor={(item, index) => index}
                            >
                            </SectionList>
                        </View>
                    </Fragment>
                )
            }else{
                return (
                    <View style = {
                        {
                            flex:11,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    }>
                        <Text style={{
                            fontFamily: 'timeburner',
                            fontSize:25,
                            color: "black",
                            marginBottom: height * 0.05,
                            marginTop: height*0.01
                        }}> Do you have industry experience?</Text>
                        <View style={{
                            flexDirection:"row"
                        }}>
                            <TouchableOpacity
                                style={{
                                    width: width * 0.3,
                                    height: height * 0.06,
                                    marginBottom: height * 0.04,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 15,
                                    backgroundColor: 'white',
                                }}
                                onPress={() => {
                                    setRenderStage(renderStage + 1)
                                }}>
                                <Text style={styles.quizFont}>No</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    width: width * 0.3,
                                    height: height * 0.06,
                                    marginBottom: height * 0.04,
                                    marginLeft: width * 0.1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 15,
                                    backgroundColor: 'white',
                                }}
                                onPress={() => {
                                    {setHasIndustryExperience(true)}
                                }}>
                                <Text style={styles.quizFont}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }

        }else if (renderStage === 2){
            return(
                <View
                    style={{
                        flex : 11,
                    }}
                >
                    <View style={{
                        flex:1,
                        marginTop: height * 0.01,
                        marginBottom:height * 0.15
                    }} >
                        <View style={{
                            left: width*0.10,
                            width: width * 0.8,
                            marginTop: height * 0.02,
                            marginBottom:height * 0.01
                        }}>
                            <Text style={{
                                fontFamily: 'timeburner',
                                fontSize:20,
                                color: "black"
                            }}>Hobbies</Text>
                        </View>
                        <TextInput
                            style={{
                                left: width*0.10,
                                marginTop: height * 0.02,
                                width: width * 0.8,
                                fontSize: 18,
                                color: 'black',
                                marginBottom: 10,
                                borderBottomColor: 'black',
                                borderBottomWidth: 2,
                            }}
                            onChangeText={setHobbiesFilter}
                            placeholder={"Search here"}
                            placeholderTextColor="grey"
                        />
                        <View style={{
                            left: width*0.10,
                            width: width * 0.8,
                        }}>
                            <SectionList sections={generateHobbiesSelection()}
                                         style={{
                                             width: width * 0.8,
                                         }}

                                         renderItem={({item}) =>
                                             <View
                                                 style={{
                                                     width: width * 0.8,
                                                 }}
                                             >
                                                 <Text
                                                     style={inpageStyle.item} onPress={() => {
                                                     hobbiesPress(item)
                                                 }}>{item.value}</Text>
                                             </View>
                                         }
                                         renderSectionHeader={({section}) => <Text style={inpageStyle.sectionHeader}>{section.title}</Text>}
                                         keyExtractor={(item, index) => index}
                            >

                            </SectionList>
                        </View>

                    </View>
                    <View style={{
                        flex:2
                    }}>
                        <Card containerStyle={{
                            borderRadius:10,
                            left: width*0.06,
                            width: width * 0.8,
                        }}>
                            <Card.Title style={{
                                fontFamily: 'timeburner',
                                fontSize:17,
                                color: "black",
                                marginBottom: height * 0.01,
                                marginTop: height*0.01
                            }}>Chosen Hobbies ({selectedHobbies.length})</Card.Title>
                            <Card.Divider/>
                            <View style={{
                            }}>
                                <SectionList sections={generateSelectedHobbies()}
                                             style={{
                                                 height:height * 0.22
                                             }}
                                             renderItem={({item}) => <Text style={inpageStyle.item} onPress={() => {
                                                 selectedHobbiesPress(item)
                                             }}>{item.value}</Text>}
                                             keyExtractor={(item, index) => index}
                                >

                                </SectionList>
                            </View>
                        </Card>
                    </View>
                </View>
            )
        }else if(renderStage === 3){
            return(
                <View style={{
                    flex:12,
                    marginBottom:height * 0.01
                }}>
                    <View>
                        <View style={{
                            left: width*0.13,
                            width: width * 0.8,
                            marginTop: height * 0.02,
                            marginBottom:height * 0.01
                        }}>
                            <Text style={{
                                fontFamily: 'timeburner',
                                fontSize:20,
                                color: "black"
                            }}>Places Lived In</Text>
                        </View>
                        <TextInput
                            style={{
                                left: width*0.13,
                                width: width * 0.8,
                                fontSize: 18,
                                color: 'black',
                                marginBottom: 10,
                                borderBottomColor: 'black',
                                borderBottomWidth: 2,
                            }}
                            onChangeText={setCountriesFilter}
                            placeholder={"Search here"}
                            placeholderTextColor="grey"
                        />
                        <SectionList
                            style={{
                                left: width*0.13,
                                width: width * 0.8,
                                height: height * 0.65
                            }}
                            sections={generateCountrySelection()}
                            renderItem={({item}) => <Text style={getCountryItemStyle(item)} onPress={() => {
                                countrySelectPress(item)
                            }}>{item.value}</Text>}
                            keyExtractor={(item, index) => index}
                        >
                        </SectionList>
                    </View>
                </View>
            )
        }

    }
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#d2d2d2"
        }}>
            {renderBody()}
            <View style={inpageStyle.quizeFooter}>
                <TouchableOpacity
                    style={styles.quizLeftButton}
                    onPress={() => {
                        setHasIndustryExperience(false)
                        if(renderStage == 0){
                            props.navigation.navigate({
                                routeName: 'Academic'
                            })
                        }else{
                            setRenderStage(renderStage - 1)
                        }
                    }}>
                    <Text style={styles.quizFont}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quizRightButton}
                    onPress={() => {
                        if(renderStage === 3){
                            save()
                        }else{
                            setRenderStage(renderStage + 1)
                        }
                    }}>
                    <Text style={styles.quizFont}>Next</Text>
                </TouchableOpacity>
            </View>
            {renderLoadingIcon()}
        </SafeAreaView>
    );
};

const inpageStyle = StyleSheet.create ({
    quizeFooter: {
        flex:1,
        flexDirection:"row",
        backgroundColor: '#d2d2d2',
        width: width,
        marginBottom:height * 0.02
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        marginBottom:3,
        fontSize: 18,
        height: 44,
        color: 'rgba(0,0,0,1.0)',
    },
    itemSelected:{
        marginBottom:3,
        fontSize: 18,
        height: 44,
        color: 'rgba(0,0,0,1.0)',
        borderColor:"rgb(0,41,93)",
        borderWidth:2,
    },
})
export default Personal;
