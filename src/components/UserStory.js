import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from "@react-navigation/native";

const UserStory = ({ userId ,userName, userImage}) => {

    const navigation = useNavigation();

    const onStoryPress = () => {
        navigation.navigate("StoryScreen", { userId });
    }

    return (
        <TouchableOpacity onPress={onStoryPress} style={styles.container}>
            <View style={styles.iconContainer}>
            <Image source={{uri: userImage}} style={styles.storyIcon}/>
            <Image source={require("../../assets/storyBorder.png")} style={styles.borderStyle}/>
            </View>
            <Text style={styles.nameStyle}>{userName}</Text>
        </TouchableOpacity>
    )
};


const styles = StyleSheet.create({
    container:{
    	justifyContent: 'center',
    	alignItems: 'center',
        marginLeft:20
       
    }, 
    storyIcon: {
        height: 55,
        width: 55,
        borderRadius: 27,
        
    },
    iconContainer: {
        justifyContent: 'center',
    	alignItems: 'center',
    },
    nameStyle: {
        color:"#e8e8e8",
        fontSize: 12,
        fontWeight:"bold",
        marginTop: 6
    },
    borderStyle: {
        height:60, 
        width: 60, 
        position:"absolute"
    }
});
export default UserStory;

