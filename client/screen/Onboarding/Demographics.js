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
    StyleSheet
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
    const [languageValues, setLanguageValues] = useState([]);
    const [languageOptions, setLanguageOptions] = useState([]);
    const [age, setAge] = useState("")
    const [forceUpdate, setForceUpdate] = useState(true);
    const [isLoading, setIsLoading] = useState(false)

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
            const languages = []
            for (let i = 0; i < languageJson.length; i++){
                const languageObject = languageJson[i]
                languages.push({id: languageObject.id, name: languageObject.value})
            }
            setLanguageOptions(languages)
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
        for (let i = 0; i < languageValues.length; i ++){
            if(languages.indexOf(languageValues[i].id) === -1){
                languages.push(languageValues[i].id)
            }
        }
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

    const renderBody = () => {
        return (
            <View style={{
                flex: 1,
                paddingTop: height * 0.02
            }}>
                <View style={{
                    flex:2
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
                    flex:2
                }}>
                    <View style={styles.inputHeader}>
                        <Text style={styles.onboardHeaderFont}>{texts.Global.Common.Languages}</Text>
                    </View>
                    <SearchableDropdown
                        multi={true}
                        chip={true}
                        selectedItems={languageValues}
                        onItemSelect={(item) => {
                            languageValues.push(item)
                            setLanguageValues(languageValues)
                            setForceUpdate(!forceUpdate)
                        }}
                        onRemoveItem={(item, index) => {
                            setLanguageValues(languageValues.filter(x => x.id !== item.id))
                        }}
                        items={languageOptions}
                        itemStyle={{
                            padding: 10,
                            marginTop: height * 0.01,
                            backgroundColor: '#ddd',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,

                        }}
                        containerStyle={{ padding: 5, width: width*0.73, marginLeft: width*0.145}}
                        itemTextStyle={{ color: '#222' }}
                        itemsContainerStyle={{ maxHeight: 140 }}
                        textInputProps={
                            {
                                underlineColorAndroid: "transparent",
                                style: {
                                    padding: 12,
                                    height: height * 0.06,
                                    borderWidth: 2,
                                    borderColor: 'black',
                                    borderRadius: 5,
                                },
                                onTextChange: {}
                            }
                        }
                        listProps={
                            {
                                nestedScrollEnabled: true,
                            }
                        }
                    />
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
})

export default Demographics;
