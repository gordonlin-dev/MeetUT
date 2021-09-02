import React, {useState} from 'react'
import {View, SafeAreaView, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, Text} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { AirbnbRating } from 'react-native-ratings';
import {styles} from '../styles'
const {height, width} = Dimensions.get('window');
const Personal = props => {
    const [selectedValue, setSelectedValue] = useState("--");

    return (
          <SafeAreaView style={styles.onboardContainer}>

            <ScrollView style={styles.onboardEmpty}>
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
                <View style={styles.onboardEmpty}>
                    <AirbnbRating showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                    <Text style={[styles.leftFont, {left: width*0.24}]}>1</Text>
                </View>

                <View style={styles.quizHeader}>
                    <Text style={styles.quizFont}>I'm not interested in other people's problems</Text>
                </View>
                <View style={styles.onboardEmpty}>
                    <AirbnbRating showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                    <Text style={[styles.leftFont, {left: width*0.24}]}>1</Text>
                </View>
                
                <View style={styles.quizHeader}>
                    <Text style={styles.quizFont}>I usually carry out my plans</Text>
                </View>
                <View style={styles.onboardEmpty}>
                    <AirbnbRating showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                    <Text style={[styles.leftFont, {left: width*0.24}]}>1</Text>
                </View>

                <View style={styles.quizHeader}>
                    <Text style={styles.quizFont}>I make friends easily</Text>
                </View>
                <View style={styles.onboardEmpty}>
                    <AirbnbRating showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                    <Text style={[styles.leftFont, {left: width*0.24}]}>1</Text>
                </View>
            </ScrollView>

            <TouchableOpacity 
                style={styles.quizLeftButton}
                onPress={() => {
                props.navigation.navigate({
                    routeName: 'Acedemic'
                })
            }}>
                <Text style={styles.quizFont}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.quizRightButton}
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


export default Personal;
