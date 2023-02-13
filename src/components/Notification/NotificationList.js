import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import ProfilePicture from "../ProfilePicture";
import moment from 'moment/moment';


const NotificationList = ({userName, userImage, date}) => {


    return (
    	<View style={styles.container}>
            <Image source={{uri: userImage}} style={styles.imageProf}/>
            <View style={{flex:1, alignItems:"center", flexDirection:"row"}}>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontWeight:"bold", color:"#FFF", marginLeft:10}}>{userName}</Text>
                    <Text style={{fontWeight:"300",color:"#FFF", marginLeft:5}}>started following you.</Text>
                </View>
                <Text style={{color:"#FFF", marginLeft:5, fontSize:12}}>{moment(date).startOf('day').fromNow()}</Text>
            </View> 
        </View>
    )
};


const styles = StyleSheet.create({
    container:{
    	width:"100%",
        padding: 10,
        flexDirection: "row",
        
    },
    imageProf: {
        height: 60,
        width: 60,
        borderRadius: 30

    }
});
export default NotificationList;