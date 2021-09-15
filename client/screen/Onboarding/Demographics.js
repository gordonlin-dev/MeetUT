import React, {useEffect, useState} from 'react'
import {View, Image, TextInput, TouchableOpacity, ScrollView, Text, SafeAreaView, Dimensions} from 'react-native'
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
    const [selectedValue, setSelectedValue] = useState("--");

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
    useEffect(() => {
        loadUser()
    }, []);

    return (
          <View style={styles.onboardContainer}>
            <View style={styles.inputHeader}>
                <Text style={styles.onboardHeaderFont}>First Name</Text>
            </View>
            <TextInput
                style={styles.onboardInput}
                onChangeText={setFirstName}
                value={firstName}
                placeholder="first name"
                placeholderTextColor="black"
            />
            <View style={styles.inputHeader}>
                <Text style={styles.onboardHeaderFont}>Last Name</Text>
            </View>
            <TextInput
              style={styles.onboardInput}
              onChangeText={setLastName}
              value={lastName}
              placeholder="last name"
              placeholderTextColor="black"
            />

            <View style={styles.pickerHeader}>
                <Text style={styles.onboardHeaderFont}>Gender</Text>

            <Picker
                style={styles.picker}
                selectedValue={selectedValue}
                ColorValue="black"
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                <Picker.Item label="--" value="--" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Other" value="other" />
                <Picker.Item label="Prefer not to say" value="no" />
            </Picker>


                    <Text style={styles.onboardHeaderFont}>Year of Study</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="--" value="--" />
                        <Picker.Item label="Other" value="other" />
                        <Picker.Item label="Prefer not to say" value="no" />
                    </Picker>
                    <Text style={styles.onboardHeaderFont}>College</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="--" value="--" />
                        <Picker.Item label="Other" value="other" />
                        <Picker.Item label="Prefer not to say" value="no" />
                    </Picker>
                </View>

            <SafeAreaView style={styles.scrollViewContainer}>
                <ScrollView style={{marginTop: height*0.05,}}>
                    <Image style={{height: height*0.08, width: width*0.12}} source={logo}/>
                </ScrollView>
            </SafeAreaView>

            <TouchableOpacity
                style={styles.quizRightButton}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Acedemic'
                })
            }}>
                <Text style={styles.quizFont}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};


export default Demographics;
