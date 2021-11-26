import React, {Fragment, useEffect, useState} from 'react';
import {
    View,
    SafeAreaView,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    SectionList, ScrollView, ActivityIndicator, TextInput
} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import RNPickerSelect from 'react-native-picker-select';
import { styles } from '../styles';
import {Card} from "react-native-elements";
const {height, width} = Dimensions.get('window');

const texts = require("../../assets/Texts.json");
const handler = require('../Handler')
const endpoints = require('../../API_endpoints.json')
const lookups = require('../Lookups.json')

const Academic = (props) => {
    const [programs, setPrograms] = useState([]);
    const [chosen, setChosen] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(true);
    const [renderStage, setRenderStage] = useState(0);
    const [degreeType, setDegreeType] = useState(0)
    const [yearOfStudy, setYearOfStudy] = useState(0)
    const [college, setCollege] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [programFilter, setProgramFilter] = useState("")
    const colorLevels = {
        [0]: '#d0d0d9',
        [1]: '#abe1f5',
        [2]: '#f2f2fc',
    };
    const renderLoadingIcon = () => {
        if(isLoading){
            return(
                <ActivityIndicator size="large" style={styles.loading} color="#0000ff" />
            )
        }
    }
    const save = async () => {
        setIsLoading(true)
        const body = {
            Programs: [],
            DegreeType: degreeType,
            YearOfStudy: yearOfStudy,
            College : college,
            SelectedPrograms: chosen
        }
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.Questionnaire.Academics,
            texts.HTTP.Post,
            body,
            false,
            props
        )

        if(response.ok){
            setIsLoading(false)
            props.navigation.navigate('Personal')
        }
    }
    const getData = async () => {
        setIsLoading(true)
        const response = await handler.sendRequest(
            endpoints.Server.Onboarding.Questionnaire.Academics,
            texts.HTTP.Get,
            {},
            false,
            props
        )
        if(response.ok){
            setIsLoading(false)
            const responseJson = await response.json();
            setPrograms(responseJson.programs)
            setDegreeType(responseJson.DegreeType)
            setYearOfStudy(responseJson.YearOfStudy)
            setCollege(responseJson.College)
            generateProgramSection()
        }
    }

    const generateProgramSection = () => {
        let sections = []
        for (let i = 0; i < programs.length; i++){
            let section = {
                title:programs[i].categoryValue,
                data:programs[i].content.sort((a,b) => {return a.programId - b.programId})
            }
            section.data = section.data.filter(x => x.value.includes(programFilter))
            if(section.data.length > 0){
                sections.push(section)
            }
        }
        return sections
    }

    const generateChosenSection = () => {
        let sections = []
        sections.push({
            title:"Selected",
            data:chosen
        })
        return sections
    }

    const programsListPress = (program) => {
        if(chosen.length < 3){
            const filtered = chosen.filter(element => element.programId === program.programId)
            if(filtered.length === 0){
                chosen.push(program)
                setChosen(chosen)
                removeProgram(program.programId)
                setForceUpdate(!forceUpdate)
            }
        }
    }

    const removeProgram = (programId) =>{
        for(let i = 0; i < programs.length; i++){
            programs[i].content = programs[i].content.filter(element => element.programId !== programId)
        }
        setPrograms(programs)
    }
    const addProgram = (program) => {
        for(let i = 0; i < programs.length; i ++){
            if(program.categoryIds.filter(element => element === programs[i].categoryId).length > 0){
                if(programs[i].content.filter(element => element.programId === program.programId).length === 0){
                    programs[i].content.push(program)
                    programs[i].content.sort((a,b) => {return a.programId - b.programId})
                }
            }
        }
        setPrograms(programs)
    }
    const chosenListPress = (program) =>{
        setChosen(chosen.filter(element => element.programId !== program.programId))
        addProgram(program)
        setForceUpdate(!forceUpdate)
    }

    const generateDegreePicker = () =>{
        let items = []
        const options = lookups.Academic.DegreeType
        for (const option in options) {
            const obj = options[option]
            items.push(<Picker.Item key ={obj.Value} value={obj.Value} label={obj.DisplayValue} />)
        }
        return items
    }
    const generateYearPicker = () =>{
        let items = []
        const options = lookups.Academic.YearOfStudy
        for (const option in options) {
            const obj = options[option]
            items.push(<Picker.Item key ={obj.Value} value={obj.Value} label={obj.DisplayValue} />)
        }
        return items
    }
    const generateCollegePicker = () =>{
        let items = []
        const options = lookups.Academic.College
        for (const option in options) {
            const obj = options[option]
            items.push(<Picker.Item key ={obj.Value} value={obj.Value} label={obj.DisplayValue} />)
        }
        return items
    }
    const renderBody = () => {
        if(renderStage === 0) {
            //render degree type, year of study, college
            return(
                <Fragment>
                    <View style={{
                        flex: 12
                    }}>
                        <View style={styles.inputHeader}>
                            <Text style={styles.onboardHeaderFont}>Degree</Text>
                        </View>
                        <View style={{
                            left: width*0.17,

                        }}>
                            <Picker
                                style={{
                                    height : height * 0.20,
                                    width: width * 0.7,
                                }}
                                itemStyle={{
                                    height : height * 0.20,
                                    width: width * 0.7,
                                }}
                                selectedValue={degreeType}
                                ColorValue="black"
                                onValueChange={(itemValue, itemIndex) => setDegreeType(itemValue)}>
                                {generateDegreePicker()}
                            </Picker>
                        </View>
                        <View style={styles.inputHeader}>
                            <Text style={styles.onboardHeaderFont}>Year</Text>
                        </View>
                        <View style={{
                            left: width*0.17,

                        }}>
                            <Picker
                                style={{
                                    height : height * 0.20,
                                    width: width * 0.7,
                                }}
                                itemStyle={{
                                    height : height * 0.20,
                                    width: width * 0.7,
                                }}
                                selectedValue={yearOfStudy}
                                ColorValue="black"
                                onValueChange={(itemValue, itemIndex) => setYearOfStudy(itemValue)}>
                                {generateYearPicker()}
                            </Picker>
                        </View>
                        <View style={styles.inputHeader}>
                            <Text style={styles.onboardHeaderFont}>College</Text>
                        </View>
                        <View style={{
                            left: width*0.17,

                        }}>
                            <Picker
                                style={{
                                    height : height * 0.20,
                                    width: width * 0.7,
                                }}
                                itemStyle={{
                                    height : height * 0.20,
                                    width: width * 0.7,
                                }}
                                selectedValue={college}
                                ColorValue="black"
                                onValueChange={(itemValue, itemIndex) => setCollege(itemValue)}>
                                {generateCollegePicker()}
                            </Picker>
                        </View>
                    </View>
                </Fragment>
            )
        }else if(renderStage === 1){
            //render programs
            return (
                <View
                    style={{
                        flex : 11,
                    }}
                >
                    <View style={{
                        flex:1,
                        marginTop: height * 0.04,
                        marginBottom:height * 0.15
                    }} >
                        <View style={{
                            left: width*0.10,

                        }}>
                            <Text style={styles.onboardHeaderFont}>Programs</Text>
                        </View>
                        <TextInput
                            style={{
                                left: width*0.10,
                                marginTop: height * 0.02,
                                width: width * 0.8,
                                fontSize: 18,
                                color: 'black',
                                marginBottom: 10,
                                borderBottomColor: 'black',
                                borderBottomWidth: 2,
                            }}
                            onChangeText={setProgramFilter}
                            placeholder={"Search here"}
                            placeholderTextColor="grey"
                        />
                        <View style={{
                            left: width*0.10,
                            width: width * 0.8,
                        }}>
                            <SectionList sections={generateProgramSection()}
                                         style={{
                                             width: width * 0.8,
                                         }}

                                         renderItem={({item}) =>
                                             <View
                                                 style={{
                                                     width: width * 0.8,
                                                 }}
                                             >
                                                 <Text
                                                     style={inpageStyle.item} onPress={() => {
                                                     programsListPress(item)
                                                 }}>{item.value}</Text>
                                             </View>
                                             }
                                         renderSectionHeader={({section}) => <Text style={inpageStyle.sectionHeader}>{section.title}</Text>}
                                         keyExtractor={(item, index) => index}
                            >

                            </SectionList>
                        </View>

                    </View>
                    <View style={{
                        flex:2
                    }}>
                        <Card containerStyle={{
                            borderRadius:10,
                            left: width*0.06,
                            width: width * 0.8,
                        }}>
                            <Card.Title style={{
                                fontFamily: 'timeburner',
                                fontSize:17,
                                color: "black",
                                marginBottom: height * 0.01,
                                marginTop: height*0.01
                            }}>Chosen Programs ({chosen.length}/3)</Card.Title>
                            <Card.Divider/>
                            <View style={{
                            }}>
                                <SectionList sections={generateChosenSection()}
                                             renderItem={({item}) => <Text style={inpageStyle.item} onPress={() => {
                                                 chosenListPress(item)
                                             }}>{item.value}</Text>}
                                             keyExtractor={(item, index) => index}
                                >

                                </SectionList>
                            </View>
                        </Card>
                        <Text style={styles.headerFont}></Text>
                        <View style={{
                            left: width*0.10,
                            marginTop: height * 0.1,
                            marginBottom:height * 0.01
                        }}>
                            <Text style={styles.onboardHeaderFont}></Text>
                        </View>


                    </View>
                </View>
            )
        }
    }

    useEffect(() => {
        getData()
    }, []);


    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#d2d2d2"
        }} >
            {renderLoadingIcon()}
            {renderBody()}
            <View style={{
                flex:1,
                alignSelf:"flex-end"
            }}>
                <View style={inpageStyle.quizeFooter}>
                    <TouchableOpacity
                        style={styles.quizLeftButton}
                        onPress={() => {
                            if(renderStage == 0){
                                props.navigation.navigate({
                                    routeName: 'Demographics'
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
            </View>

        </SafeAreaView>
    );

}

const inpageStyle = StyleSheet.create ({
    quizeFooter: {
        flexDirection:"row",
        backgroundColor: '#d2d2d2',
        width: width,
        marginBottom:height * 0.02
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 19,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        marginLeft:10,
        marginBottom:10,
        fontSize: 18,
        height: 44,
    },
})
export default Academic;
