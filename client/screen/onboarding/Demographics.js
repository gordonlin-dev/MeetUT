import React, {useState} from 'react'
import {View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, Alert} from 'react-native'
import RNPickerSelect from 'react-native-picker-select';

const {height, width} = Dimensions.get('window');

const Demographics = props => {
    const [firstName, onChangeFirstName] = useState("");
    const [lastName, onChangeLastName] = useState("");
    const [selectedValue, setSelectedValue] = useState("gender");

    return (
          <View style={styles.container}>

            <TextInput
                style={styles.Input}
                onChangeText={onChangeFirstName}
                value={firstName}
                placeholder="first name"
                placeholderTextColor="black"
            />
            <TextInput
              style={styles.Input}
              onChangeText={onChangeLastName}
              value={lastName}
              placeholder="last name"
              placeholderTextColor="black"
            />
            <RNPickerSelect
                onValueChange={(value) => console.log(value)}
                items={[
                    { label: 'Female', value: 'Female' },
                    { label: 'Male', value: 'Male' },
                    { label: 'Prefer not to say', value: 'no' },
                ]}
                placeholder='Gender'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        alignItems: "center"
    },
    Input: {
        marginTop: height * 0.03,
        height: height * 0.06,
        width: width * 0.7,
        borderRadius: 5,
        borderWidth: 2,
        padding: 10,
        borderColor: "black",
        color: "black"
    },
    picker: {
        width: width * 0.6,
        height: height * 0.06,
        marginTop: height * 0.04,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    header: {
        fontSize:50,
        marginLeft: width * 0.34,
        color: "white",
        fontFamily: 'timeburner',
    },
    font: {
        fontFamily: 'timeburner',
        fontSize:18,
        color: "#0E0EA1",
        fontWeight: "500"
    }
  });

export default Demographics;
