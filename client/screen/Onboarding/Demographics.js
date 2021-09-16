import React, {useEffect, useState} from 'react'
import {View, Image, TextInput, TouchableOpacity, ScrollView, Text, SafeAreaView, Dimensions} from 'react-native'
import SearchableDropdown from 'react-native-searchable-dropdown';
import {Picker} from '@react-native-picker/picker';
import {styles} from '../styles'
const logo =  require('../../assets/logo.png');
const {height, width} = Dimensions.get('window');

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')

const Demographics = props => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [genderValue, setGenderValue] = useState("");
    const [religionValue, setReligionValue] = useState("");

    const loadUser = async () =>{
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.User.baseURL,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if(response.ok){
            const responseJson = await response.json()
            console.log(responseJson)
            setFirstName(responseJson.firstName);
            setLastName(responseJson.lastName)
        }
    }

    const generateGenderPicker = () => {
        let items = []
        const options = texts.Screens.Demographics.Gender
        items.push(<Picker.Item key ={""} value={""} label={""} />)
        for (const option in options) {
            const value = options[option]
            items.push(<Picker.Item key ={value} value={value} label={value} />)
        }
        return items
    }
    const generateReligionPicker = () => {
        let items = []
        const options = texts.Screens.Demographics.Religions
        items.push(<Picker.Item key ={""} value={""} label={""} />)
        for (const option in options) {
            const value = options[option]
            items.push(<Picker.Item key ={value} value={value} label={value} />)
        }
        return items
    }
    const renderGenderOtherInput = () => {
        if(genderValue === texts.Screens.Demographics.Gender.Other){
            return (
                <View style={styles.pickerHeader}>
                    <Text style={styles.onboardHeaderFont}>{texts.Global.Common.Specify}</Text>
                    <TextInput
                        style={styles.picker}
                        onChangeText={setGenderValue}
                    />
                </View>
            )
        }
    }
    const renderReligionOtherInput = () => {
        if(religionValue === texts.Screens.Demographics.Religions.Other){
            return (
                <View style={styles.pickerHeader}>
                    <Text style={styles.onboardHeaderFont}>{texts.Global.Common.Specify}</Text>
                    <TextInput
                        style={styles.picker}
                        onChangeText={setReligionValue}
                    />
                </View>
            )
        }
    }
    useEffect(() => {
        loadUser()
    }, []);

    return (
          <View style={styles.onboardContainer}>
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

            <View style={styles.pickerHeader}>
                <Text style={styles.onboardHeaderFont}>{texts.Global.Common.Gender}</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={genderValue}
                    ColorValue="black"
                    onValueChange={(itemValue, itemIndex) => setGenderValue(itemValue)}>
                    {generateGenderPicker()}
                </Picker>
            </View>
              {renderGenderOtherInput()}
            <View style={styles.pickerHeader}>
                <Text style={styles.onboardHeaderFont}>{texts.Global.Common.Religion}</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={religionValue}
                    ColorValue="black"
                    onValueChange={(itemValue, itemIndex) => setReligionValue(itemValue)}>
                    {generateReligionPicker()}
                </Picker>
            </View>
              {renderReligionOtherInput()}
            <View>
                <SearchableDropdown>

                </SearchableDropdown>
            </View>
            <TouchableOpacity
                style={styles.quizRightButton}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Academic'
                })
            }}>
                <Text style={styles.quizFont}>{texts.Screens.Demographics.Buttons.SaveAndContinue}</Text>
            </TouchableOpacity>
        </View>
    );
};


export default Demographics;
