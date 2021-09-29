import React, {useState} from 'react'
import {View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Text, SafeAreaView} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { AirbnbRating } from 'react-native-ratings';
const {height, width} = Dimensions.get('window');
import {styles} from '../styles'
const SpecificHobby = props => {
    const [selectedValue, setSelectedValue] = useState("--");

    return (
          <SafeAreaView style={styles.onboardContainer}>
            <ScrollView style={styles.onboardEmpty}>

              <View style={styles.pickerHeader}>
                  <Text style={styles.headerFont}>Chosen general activity</Text>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedValue}
                    ColorValue="black"
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                  >
                    <Picker.Item label="--" value="--" />
                    <Picker.Item label="Other" value="other" />
                    <Picker.Item label="Prefer not to say" value="no" />
                  </Picker>
              </View>

              <View style={styles.quizHeader}>
                  <Text style={styles.quizFont}>How much do you enjoy this activity?</Text>
              </View>
              <View style={styles.onboardEmpty}>
                  <AirbnbRating count="7" showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                  <Text style={styles.leftFont}>1</Text>
              </View>

              <View style={styles.pickerHeader}>
                  <Text style={styles.headerFont}>Chosen general activity</Text>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedValue}
                    ColorValue="black"
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                  >
                    <Picker.Item label="--" value="--" />
                    <Picker.Item label="Other" value="other" />
                    <Picker.Item label="Prefer not to say" value="no" />
                  </Picker>
              </View>

              <View style={styles.quizHeader}>
                  <Text style={styles.quizFont}>How much do you enjoy this activity?</Text>
              </View>
              <View style={styles.onboardEmpty}>
                  <AirbnbRating count="7" showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                  <Text style={styles.leftFont}>1</Text>
              </View>


              <View style={styles.pickerHeader}>
                  <Text style={styles.headerFont}>Chosen general activity</Text>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedValue}
                    ColorValue="black"
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                  >
                    <Picker.Item label="--" value="--" />
                    <Picker.Item label="Other" value="other" />
                    <Picker.Item label="Prefer not to say" value="no" />
                  </Picker>
              </View>

              <View style={styles.quizHeader}>
                  <Text style={styles.quizFont}>How much do you enjoy this activity?</Text>
              </View>
              <View style={styles.onboardEmpty}>
                  <AirbnbRating count="7" showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                  <Text style={styles.leftFont}>1</Text>
              </View>

              <View style={styles.pickerHeader}>
                  <Text style={styles.headerFont}>Chosen general activity</Text>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedValue}
                    ColorValue="black"
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                  >
                    <Picker.Item label="--" value="--" />
                    <Picker.Item label="Other" value="other" />
                    <Picker.Item label="Prefer not to say" value="no" />
                  </Picker>
              </View>

              <View style={styles.quizHeader}>
                  <Text style={styles.quizFont}>How much do you enjoy this activity?</Text>
              </View>
              <View style={styles.onboardEmpty}>
                  <AirbnbRating count="7" showRating={false} selectedColor="#3590F2" reviewColor="#3590F2"/>
                  <Text style={styles.leftFont}>1</Text>
              </View>
              <Text style={styles.leftFont}></Text>


              </ScrollView>

              <TouchableOpacity 
                  style={styles.quizLeftButton}
                  onPress={() => {
                  props.navigation.navigate({
                      routeName: 'Hobbies'
                  })
              }}>
                  <Text style={styles.quizFont}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={styles.quizRightButton}
                  onPress={() => {
                  props.navigation.navigate({
                      routeName: 'ProjectInterests'
                  })
              }}>
                  <Text style={styles.quizFont}>Next</Text>
              </TouchableOpacity>
          </SafeAreaView>
    );
};

export default SpecificHobby;
