import React, {useEffect, useState} from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import { styles } from '../styles';
import NestedListView from 'react-native-nested-listview'
const secureStore = require('../../SecureStore')
const headers = require('../Headers')
const {height, width} = Dimensions.get('window');

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')

const Academic = (props) => {
    const [programs, setPrograms] = useState([]);
    const [chosen, setChosen] = useState([]);
    const colorLevels = {
        [0]: '#d0d0d9',
        [1]: '#abe1f5',
        [2]: '#f2f2fc',
    };

    const submit = async (props, chosen) => {

        try{
            const accessToken = await secureStore.GetValue('JWT')
            const url = 'https://meet-ut-1.herokuapp.com/questionnaire/programs'
            const response = await fetch(url, {
                method : 'POST',
                headers: headers.authorized(accessToken),
                body: JSON.stringify({
                    Programs: chosen
                })
            });
            const responseJson = await response.json();
            props.navigation.navigate({
                routeName: 'Personal'
            })


        }catch (e) {
            console.log(e);
        }
    }
    const loadPrograms = async () => {
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.Questionnaire.Programs,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if(response.ok){
            const responseJson = await response.json();
            console.log(responseJson)
            setPrograms(responseJson)
        }
    }
    useEffect(() => {
        console.log(123)
        loadPrograms()
    }, []);

    const sortedPrograms = [];
    for (let i = 0; i < programs.length; i++) {
        const temp = {};
        temp.title = programs[i].categoryValue;
        temp.items = [];
        for (let j = 0; j < programs[i].content.length; j++) {
            temp.items.push({title: programs[i].content[j].value, id: programs[i].content[j].programId})
        }
        sortedPrograms.push(temp)
    }
    const toggleChecked = (node) => {
        if (chosen.some(el => el.value === node.title)) {
            const newSelected = chosen.filter((id) => id !== node.id);
            setChosen(newSelected);
        } else {
            chosen.push({programId: node.id, value: node.title})
        }
    }

    const unselect = (props) => {
        for (let i = 0; i < chosen.length; i++) {
            if (chosen[i].value === props.value) {
                chosen.splice(i, 1)
            }
        }
    }
    const renderNode = (node, level) => {
        const paddingLeft = (level ?? 0 + 1) * 30;
        const backgroundColor = colorLevels[level ?? 0] || 'white';
        if (level === 1) {
            return (
                <View style={[styles.row, { backgroundColor, paddingLeft }]}>
                    <Text style={styles.headerFont}>{node.title}</Text>
                </View>
            );

        } else {
            return (
                <View style={[styles.row, { backgroundColor, paddingLeft }]}>
                    <Text style={styles.headerFont}>{node.title}</Text>
                    <TouchableOpacity style={styles.selectButton} onPress={() => toggleChecked(node)}>
                    <Text style={styles.headerFont}>select</Text>
                    </TouchableOpacity>
                </View>
            );
        }

    };

    return (
        <SafeAreaView style={styles.quizContainer} >

            <View style={styles.scrollContainer} >
                <Text style={styles.headerFont}>Programs</Text>
                <NestedListView
                    data={sortedPrograms}
                    renderNode={renderNode}
                />
            </View>
            <View style={styles.selectedContainer}>
            <Text style={styles.headerFont}>chosen Programs ({chosen.length})</Text>
                <ScrollView style={styles.outputContainer}>

                    {chosen.map((props) => {
                        return(
                            <View style={{flexDirection: 'row',}} key={props.programId}>
                                <View style={styles.outputCard}>
                                    <Text style={styles.quizFont}>{props.value}</Text>
                                </View>
                                <TouchableOpacity style={styles.swipeButton} onPress={() => unselect(props)}>
                                        <Text style={styles.headerFont}>Unselect</Text>
                                </TouchableOpacity>
                            </View>


                        )

                    })}
                </ScrollView>
            </View>

                <View style={inpageStyle.quizeFooter}>
                <TouchableOpacity
                    style={styles.quizLeftButton}
                    onPress={() => {
                    props.navigation.navigate({
                        routeName: 'Demographics'
                    })
                }}>
                    <Text style={styles.quizFont}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quizRightButton}
                    onPress={() => {
                        submit(props, chosen)

                }}>
                    <Text style={styles.quizFont}>Next</Text>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    );

}

const inpageStyle = StyleSheet.create ({
    quizeFooter: {
        position: "absolute",
        backgroundColor: '#e1e1ea',
        height: height * 0.1,
        width: width,
        top: height*0.82
    },
})
export default Academic;
