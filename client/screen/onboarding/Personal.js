import React, {useState} from 'react'
import {View, SafeAreaView, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, Text} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { AirbnbRating } from 'react-native-ratings';
const {height, width} = Dimensions.get('window');
const Personal = props => {
    const [selectedValue, setSelectedValue] = useState("--");

    return (
          <SafeAreaView style={styles.container}>

            <ScrollView style={styles.scrollView}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.headerFont}>Country of Birth</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedValue}
                        ColorValue="black"
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="--" value="--" />
                        <Picker.Item label="Canada" value="Canada" />
                        <Picker.Item label="China" value="China" />
                        <Picker.Item label="Other" value="other" />
                        <Picker.Item label="Prefer not to say" value="no" />
                    </Picker>
                </View>
                
                <View style={styles.pickerHeader}>
                    <Text style={styles.headerFont}>Country spent longest in</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="--" value="--" />
                        <Picker.Item label="Canada" value="Canada" />
                        <Picker.Item label="China" value="China" />
                        <Picker.Item label="Other" value="other" />
                        <Picker.Item label="Prefer not to say" value="no" />
                    </Picker>
                </View>

                <View style={styles.pickerHeader}>
                    <Text style={styles.headerFont}>Religious affiliation</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="--" value="--" />
                        <Picker.Item label="Other" value="other" />
                        <Picker.Item label="Prefer not to say" value="no" />
                    </Picker>
                    <Text style={styles.headerFont}>Personality Quiz</Text>
                </View>

                <View style={styles.quizHeader}>
                    <Text style={styles.quizFont}>I seldom feel blue</Text>
                </View>
                <View style={styles.quizContainer}>
                    <AirbnbRating showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                    <Text style={styles.leftFont}>1</Text>
                </View>

                <View style={styles.quizHeader}>
                    <Text style={styles.quizFont}>I'm not interested in other people's problems</Text>
                </View>
                <View style={styles.quizContainer}>
                    <AirbnbRating showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                    <Text style={styles.leftFont}>1</Text>
                </View>
                
                <View style={styles.quizHeader}>
                    <Text style={styles.quizFont}>I usually carry out my plans</Text>
                </View>
                <View style={styles.quizContainer}>
                    <AirbnbRating showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                    <Text style={styles.leftFont}>1</Text>
                </View>

                <View style={styles.quizHeader}>
                    <Text style={styles.quizFont}>I make friends easily</Text>
                </View>
                <View style={styles.quizContainer}>
                    <AirbnbRating showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                    <Text style={styles.leftFont}>1</Text>
                    <Text style={styles.leftFont}></Text>
                    <Text style={styles.leftFont}></Text>
                    <Text style={styles.leftFont}></Text>
                </View>
            </ScrollView>

            <TouchableOpacity 
                style={styles.leftButton}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Acedemic'
                })
            }}>
                <Text style={styles.quizFont}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.Button}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Reason'
                })
            }}>
                <Text style={styles.quizFont}>Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e1e1ea"
    },
    scrollView: {
    },
    leftButton: {
        position: 'absolute',
        width: width * 0.45,
        height: height * 0.06,
        bottom: height*0.01,
        left: width*0.02,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: "black",
        backgroundColor: 'white',
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
        marginTop: height * 0.02,
        left: width*0.15
    },
    quizHeader: {
        marginTop: height * 0.02,
        alignItems: 'center',
    },
    quizFont: {
        fontFamily: 'timeburner',
        fontSize:17,
        color: "black"  
    },
    quizContainer: {
        
    },
    picker: {
        width: width * 0.7,
        height: height * 0.055,
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
    leftFont: {
        fontFamily: 'timeburner',
        fontSize:12,
        color: "black",  
        left: width*0.24,
    },
  });

export default Personal;
