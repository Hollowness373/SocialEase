import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native';
import UserStory from './UserStory';
import stories from "../../assets/data/Stories.json";
import SizedBox from './SizedBox';

const UserStoryList = () => {

    const onNewStory = () => {
        console.warn("Create a new story");
    };

    return (
        <View style={styles.storyContainer}>
            <TouchableOpacity onPress={onNewStory} style={{justifyContent:"center", alignItems:"center"}} >
                <Image source={require("../../assets/newStoryIcon.png")} style={styles.storyIcon}/>
                <Text style={styles.nameStyle}>Your story</Text>
            </TouchableOpacity>
            <SizedBox width={20} />
            <View style={styles.container}>
    		    <FlatList
                    data={stories}
                    renderItem={({item}) => <UserStory userName={item.username} userImage={item.image} userId={item.id}/>}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
    	    </View>  
        </View>
    	
    )
};


const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    // STORY
    storyContainer: {
        height: 100,
        width:"100%",
        backgroundColor: "#040B20",
        paddingLeft: 15,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center"
    },
    storyIcon:{
        height: 55,
        width: 55,
        marginBottom: 5,
        
    },
    nameStyle: {
        color:"#e8e8e8",
        fontSize: 12,
        fontWeight:"bold"
    }

});
export default UserStoryList;