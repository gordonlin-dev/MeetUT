import React, {useState} from 'react'
import {View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, Text, SafeAreaView} from 'react-native'
import {Picker} from '@react-native-picker/picker';

const {height, width} = Dimensions.get('window');
const logo =  require('../../assets/logo.png');
const Demographics = props => {
    const [firstName, onChangeFirstName] = useState("");
    const [lastName, onChangeLastName] = useState("");
    const [selectedValue, setSelectedValue] = useState("--");

    return (
          <View style={styles.container}>
            <View style={styles.inputHeader}>
                <Text style={styles.headerFont}>First Name</Text>
            </View>
            <TextInput
                style={styles.Input}
                onChangeText={onChangeFirstName}
                value={firstName}
                placeholder="first name"
                placeholderTextColor="black"
            />
            <View style={styles.inputHeader}>
                <Text style={styles.headerFont}>Last Name</Text>
            </View>
            <TextInput
              style={styles.Input}
              onChangeText={onChangeLastName}
              value={lastName}
              placeholder="last name"
              placeholderTextColor="black"
            />
            
            <View style={styles.pickerHeader}>
                <Text style={styles.headerFont}>Gender</Text>
            
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
            
                    
                    <Text style={styles.headerFont}>Year of Study</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="--" value="--" />
                        <Picker.Item label="Other" value="other" />
                        <Picker.Item label="Prefer not to say" value="no" />
                    </Picker>
                    <Text style={styles.headerFont}>College</Text>
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
                style={styles.Button}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Acedemic'
                })
            }}>
                <Text style={styles.font}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "#e1e1ea"
    },
    scrollViewContainer: {
        flex: 1,
        alignItems: 'center',
    },
    Button: {
        position: 'absolute',
        width: width * 0.45,
        height: height * 0.06,
        bottom: height*0.01,
        right: width*0.02,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: "black",
        backgroundColor: 'white',
      },
    pickerHeader: {
        marginTop: height * 0.01,
        left: width*0.16,
    },
    inputHeader: {
        left: width*0.16,
        marginTop: height * 0.01,
    },
    Input: {
        left: width*0.16,
        height: height * 0.06,
        width: width * 0.7,
        borderRadius: 5,
        borderWidth: 2,
        padding: 10,
        borderColor: "black",
        color: "black"
    },
    picker: {
        
        width: width * 0.7,
        height: height * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        color: "black"
        
    },
    header: {
        fontSize:50,
        marginLeft: width * 0.34,
        color: "white",
        fontFamily: 'timeburner',
    },
    headerFont: {
        fontFamily: 'timeburner',
        fontSize:17,
        color: "black"  
    },
    font: {
        fontFamily: 'timeburner',
        fontSize:18,
        color: "black",
        fontWeight: "500"
    },
    scrollView: {
        marginTop: height*0.05,
    },
    avator: {
        height: height*0.08,
        width: width*0.12
    }
  });

export default Demographics;
