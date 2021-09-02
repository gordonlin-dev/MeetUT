import React, {useState} from 'react'
import {View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, Text, SafeAreaView} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {styles} from '../styles'
const logo =  require('../../assets/logo.png');
const Demographics = props => {
    const [firstName, onChangeFirstName] = useState("");
    const [lastName, onChangeLastName] = useState("");
    const [selectedValue, setSelectedValue] = useState("--");

    return (
          <View style={styles.onboardContainer}>
            <View style={styles.inputHeader}>
                <Text style={styles.onboardHeaderFont}>First Name</Text>
            </View>
            <TextInput
                style={styles.onboardInput}
                onChangeText={onChangeFirstName}
                value={firstName}
                placeholder="first name"
                placeholderTextColor="black"
            />
            <View style={styles.inputHeader}>
                <Text style={styles.onboardHeaderFont}>Last Name</Text>
            </View>
            <TextInput
              style={styles.onboardInput}
              onChangeText={onChangeLastName}
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
                <ScrollView style={styles.scrollView}>
                    <Image style={styles.avator} source={logo}/>
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
