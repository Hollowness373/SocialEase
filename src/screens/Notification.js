import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import notification from "../../assets/data/notification.json";
import NotificationList from '../components/Notification/NotificationList';

const Notification = () => {

    

    return (
    	<View style={styles.container}>
  		    <View style={styles.headContainer} >
				<Text style={styles.headerTitle}> Notifications</Text>
			</View>
            <FlatList 
                data={notification}
                renderItem={({item}) =>  <NotificationList 
                    userImage={item.image} 
                    userName={item.username} 
                    date={item.createdAt}
                />}
            />

  	</View>
    )
};


const styles = StyleSheet.create({
    container: {
		flex: 1,
		backgroundColor: "#040B20",
	},
	// HEADER
	headContainer: {
		backgroundColor:"#00040F",
		flexDirection: "row",
		alignItems:"center",
		width:"100%",
		height: "8%",
	},
	iconStyle: {
		height: 30, 
		width: 30,
	},
	headerTitle: {
		color:"#FFF",
		fontSize: 20,
		fontStyle:"italic",
		marginLeft: 10
	},
});
export default Notification;