import React, {Fragment, useEffect, useState} from 'react'
import {View, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, Text, StyleSheet, SectionList} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import {styles} from '../styles'
const {height, width} = Dimensions.get('window');

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
const lookups = require('../Lookups.json')


const Personal = props => {
    const [reasons, setReasons] = useState([]);
    const [renderStage, setRenderStage] = useState(0);

    useEffect(() => {
        getData()
    }, []);

    const getData = async () => {
        
    }
    const generateReasonsSelection = () => {

    }
    const renderBody = () => {
        return(
            <Fragment>
                <View style={styles.selectedContainer}>
                    <Text style={styles.headerFont}>Chosen Programs ({chosen.length})</Text>
                    <SectionList sections={generateReasonsSelection()}
                                 renderItem={({item}) => <Text style={inpageStyle.item} onPress={() => {
                                     chosenListPress(item)
                                 }}>{item.value}</Text>}
                                 keyExtractor={(item, index) => index}
                    >

                    </SectionList>
                </View>
            </Fragment>
        )
    }
    return (
        <SafeAreaView style={styles.onboardContainer}>

            <View style={inpageStyle.quizeFooter}>
                <TouchableOpacity
                    style={styles.quizLeftButton}
                    onPress={() => {
                        if(renderStage == 0){
                            props.navigation.navigate({
                                routeName: 'Academic'
                            })
                        }else{

                            setRenderStage(renderStage - 1)
                        }
                    }}>
                    <Text style={styles.quizFont}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quizRightButton}
                    onPress={() => {
                        if(renderStage === 1){
                            save()
                        }else{
                            setRenderStage(renderStage + 1)
                        }
                    }}>
                    <Text style={styles.quizFont}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const inpageStyle = StyleSheet.create ({
    quizeFooter: {
        position: "absolute",
        backgroundColor: '#e1e1ea',
        height: height * 0.1,
        width: width,
        top: height*0.82
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
export default Personal;
