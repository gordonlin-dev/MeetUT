import React, {useEffect, useState} from 'react'
import {
    View,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Text,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
    StyleSheet, SectionList
} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {styles} from '../styles'
const logo =  require('../../assets/logo.png');
const {height, width} = Dimensions.get('window');

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')

const Demographics = props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("")
    const [forceUpdate, setForceUpdate] = useState(true);
    const [isLoading, setIsLoading] = useState(false)
    const [languages, setLanguages] = useState([])
    const [selectedLanguages, setSelectedLanguages] = useState([])
    const [languageFilter, setLanguageFilter] = useState("")
    const renderLoadingIcon = () => {
        if(isLoading){
            return(
                <ActivityIndicator size="large" style={styles.loading} color="#0000ff" />
            )
        }
    }
    const loadUser = async () =>{
        setIsLoading(true)
        const languageResponse = await handler.sendRequest(
            endpoints.Server.Onboarding.Questionnaire.Languages,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if (languageResponse.ok){
            const languageJson = await languageResponse.json()
            setLanguages(languageJson)
        }
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.User.baseURL,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if(response.ok){
            setIsLoading(false)
            const responseJson = await response.json()
            setFirstName(responseJson.firstName);
            setLastName(responseJson.lastName)
        }
    }

    const save = async () => {
        setIsLoading(true)
        const languages = []

        const body = {
            FirstName : firstName,
            LastName : lastName,
            Gender : "",
            Religion: "",
            Languages : languages,
            DateOfBirth : new Date(new Date().getFullYear() - age, 0,1)
        }
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.Questionnaire.Demographics,
            texts.HTTP.Post,
            body,
            false,
            props
        )
        const body2 = {
            firstName : firstName,
            lastName : lastName
        }
        const response2 = await handler.sendRequest(
            endpoints.Server.User.User.UpdateName,
            texts.HTTP.Post,
            body2,
            false,
            props
        )
        const response3 = await handler.sendRequest(
            endpoints.Server.Chat.UpdateName,
            texts.HTTP.Post,
            body2,
            false,
            props
        )
        if(response.ok && response2.ok && response3.ok){
            setIsLoading(false)
            props.navigation.navigate('Academic')
        }
    }
    useEffect(() => {
        loadUser()
    }, []);

    const generateLanguageSelection = () => {
        const notSelected = languages.filter(x =>
            (selectedLanguages.indexOf(x) === -1) &&
            (x.value.includes(languageFilter))
        )
        let selectedSection = {
            title:"",
            data:selectedLanguages.sort((a,b) => {return a.value > b.value})
        }
        let section = {
            title:"",
            data:notSelected.sort((a,b) => {return a.value > b.value})
        }
        return [selectedSection,section]
    }
    const getLanguageItemStyle = (item) => {
        if(selectedLanguages.filter(x => x.id === item.id).length === 0){
            return inpageStyle.item
        }else{
            return inpageStyle.itemSelected
        }
    }
    const languageSelectPress = (item) => {
        if(selectedLanguages.filter(x => x.id === item.id).length === 0){
            selectedLanguages.push(item)
            setSelectedLanguages(selectedLanguages)
        }else{
            setSelectedLanguages(selectedLanguages.filter(x => x.id !== item.id))
        }
        setForceUpdate(!forceUpdate)
    }
    const renderBody = () => {
        return (
            <View style={{
                flex: 1,
                paddingTop: height * 0.02
            }}>
                <View style={{
                    flex:3
                }}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.onboardHeaderFont}>{texts.Global.Common.Firstname}</Text>
                    </View>
                    <TextInput
                        style={styles.onboardInput}
                        onChangeText={setFirstName}
                        value={firstName}
                        placeholder={texts.Global.Common.Firstname}
                        placeholderTextColor="black"
                    />
                    <View style={styles.inputHeader}>
                        <Text style={styles.onboardHeaderFont}>{texts.Global.Common.Lastname}</Text>
                    </View>
                    <TextInput
                        style={styles.onboardInput}
                        onChangeText={setLastName}
                        value={lastName}
                        placeholder={texts.Global.Common.Lastname}
                        placeholderTextColor="black"
                    />
                    <View style={styles.inputHeader}>
                        <Text style={styles.onboardHeaderFont}>Age</Text>
                    </View>
                    <TextInput
                        style={styles.onboardInput}
                        onChangeText={setAge}
                        value={age}
                        placeholder={"Age"}
                        placeholderTextColor="black"
                        keyboardType ="numeric"
                    />

                </View>
                <View style={{
                    flex:3,
                    left: width*0.17,
                    width: width * 0.7,
                    marginTop: height * 0.05
                }}>
                    <Text style={{
                        fontFamily: 'timeburner',
                        fontSize:20,
                        color: "black",
                        marginBottom:height * 0.01
                    }}>Languages</Text>
                    <TextInput
                        style={{
                            fontSize: 18,
                            color: 'black',
                            marginBottom: 10,
                            borderBottomColor: 'black',
                            borderBottomWidth: 2,
                        }}
                        onChangeText={setLanguageFilter}
                        placeholder={"Search here"}
                        placeholderTextColor="grey"
                    />
                    <SectionList
                        style={{
                            height: height * 0.3
                        }}
                        sections={generateLanguageSelection()}
                        renderItem={({item}) => <Text style={getLanguageItemStyle(item)} onPress={() => {
                            languageSelectPress(item)
                        }}>{item.value}</Text>}
                        keyExtractor={(item, index) => index}
                    >
                    </SectionList>
                </View>

                <View style={{
                    flex:1,
                    flexDirection:"row",
                    alignSelf:"flex-end"
                }}>
                    <View style={{
                        alignSelf:"flex-end",
                        marginBottom:height * 0.02,
                        marginRight: width * 0.03
                    }}>
                        <TouchableOpacity
                            style={{
                                width: width * 0.40,
                                height: height * 0.06,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 15,
                                borderColor: "black",
                                backgroundColor: 'white'
                            }}
                            onPress={() => {save()}}>
                            <Text style={styles.quizFont}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#d2d2d2"
        }} >
            {renderBody()}
            {renderLoadingIcon()}
        </SafeAreaView>

    );

};

const inpageStyle = StyleSheet.create ({
    quizeFooter: {
        position: "absolute",
        flexDirection:"row",
        backgroundColor: '#e1e1ea',
        height: height * 0.1,
        width: width,
        top: height*0.82
    },
    leftButtonHolder: {
        marginLeft: width * 0.02,
        width: width * 0.45,
        height: height * 0.06,
        bottom: height*0.01,
        left: width*0.02
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
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    itemSelected:{
        padding: 10,
        fontSize: 18,
        height: 44,
        color: 'rgba(0,0,0,1.0)',
        borderColor:"#3590F2",
        borderWidth:2
    }
})

export default Demographics;
