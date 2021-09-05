import React, { Component, useState } from 'react';
import { View, SafeAreaView, Dimensions, TouchableOpacity, Text, ScrollView} from 'react-native';
import { styles } from '../styles'; 
import NestedListView from 'react-native-nested-listview'
const secureStore = require('../../SecureStore')
const headers = require('../Headers')

const Hobbies = (props) => {
    const [hobbies, setHobbies] = useState([]);
    const [selected, setSelected] = useState([]);
    const colorLevels = {
        [0]: '#d0d0d9',
        [1]: '#abe1f5',
        [2]: '#f2f2fc',
    };

    const submit = async (props, selected) => {
        try{
            const userID = await secureStore.GetValue('UserId');
            const accessToken = await secureStore.GetValue('JWT')
            const url = 'https://meet-ut-1.herokuapp.com/questionnaire/hobbies'
            const response = await fetch(url, {
                method : 'POST',
                headers: headers.authorized(accessToken),
                body: JSON.stringify({
                    UserId: userID,
                    Hobbies: selected
                })
            });
            const responseJson = await response.json();
            props.navigation.navigate({
                routeName: 'SpecificHobby'
            })
            
    
        }catch (e) {
            console.log(e);
        }
    }
    const loadHobbies = async () => {
        try{
            const url = 'https://meet-ut-1.herokuapp.com/questionnaire/hobbies'
            const accessToken = secureStore.GetValue('JWT')
            const response = await fetch(url, {
                method : 'GET',
                headers: headers.authorized(accessToken),
            });
            const responseJson = await response.json();
            setHobbies(responseJson)
      
        }catch (e) {
            console.log(e);
        }
    }

    loadHobbies();
    const sortedHobbies = [];
    for (let i = 0; i < hobbies.length; i++) {
        const temp = {};
        temp.title = hobbies[i].categoryValue;
        temp.items = [];
        for (let j = 0; j < hobbies[i].content.length; j++) {
            temp.items.push({title: hobbies[i].content[j].value, id: hobbies[i].content[j].hobbyId})
        }
        sortedHobbies.push(temp)
    }
    const toggleChecked = (node) => {
        if (selected.some(el => el.value === node.title)) {
            const newSelected = selected.filter((id) => id !== node.id);
            setSelected(newSelected);
        } else {
            selected.push({hobbyId: node.id, value: node.title})
        }
    } 

    const unselect = (props) => {
        for (let i = 0; i < selected.length; i++) {
            if (selected[i].value === props.value) {
                selected.splice(i, 1)
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
                <Text style={styles.headerFont}>Activities</Text>
                <NestedListView
                    data={sortedHobbies}
                    renderNode={renderNode}
                />
            </View>
            <View style={styles.selectedContainer}>
            <Text style={styles.headerFont}>Selected Activities ({selected.length})</Text>
                <ScrollView style={styles.outputContainer}>
                    
                    {selected.map((props) => {
                        return(
                            <View style={{flexDirection: 'row',}}  key={props.hobbyId}>
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
                <TouchableOpacity 
                    style={styles.quizLeftButton}
                    onPress={() => {
                    props.navigation.navigate({
                        routeName: 'Reason'
                    })
                }}>
                    <Text style={styles.quizFont}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.quizRightButton}
                    onPress={() => {
                        submit(props, selected)
                }}>
                    <Text style={styles.quizFont}>Next</Text>
                </TouchableOpacity>
            
            
        </SafeAreaView>
    );
  
}

export default Hobbies;