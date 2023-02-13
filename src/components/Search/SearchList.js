import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { Auth } from 'aws-amplify';
import S3Image from 'aws-amplify-react-native/dist/Storage/S3Image';
import { useNavigation } from "@react-navigation/native"

const SearchList = ({userImage, userName, userId}) => {

    const navigation = useNavigation();


    const onClick = async() => {
        //Navigate to users profile page
        const { attributes } = await Auth.currentAuthenticatedUser();
        if (userId === attributes.sub){
            navigation.navigate("Profile");
        }   else {
            navigation.navigate("VisitProfile", {userId, userName, userImage});
        }
        
    }

    return (
    	<TouchableOpacity onPress={onClick} style={styles.container}>
            <S3Image imgKey={userImage} style={styles.imageProf}/>
            <View style={{flex:1, alignItems:"center", flexDirection:"row", marginLeft:10}}>
                <Text style={{fontWeight:"bold", color:"#FFF", marginLeft:10}}>{userName}</Text>
            </View> 
        </TouchableOpacity>
    )
};


const styles = StyleSheet.create({
    container:{
    	width:"100%",
        padding: 20,
        flexDirection: "row",
        
    },
    imageProf: {
        height: 50,
        width: 50,
        borderRadius: 30

    }
});
export default SearchList;