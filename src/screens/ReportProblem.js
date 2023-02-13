import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { DataStore, Auth } from 'aws-amplify';
import { Story } from  "../models"
import { PredicateAll } from '@aws-amplify/datastore/lib-esm/predicates';

const ReportProblem = () => {

  const navigation = useNavigation();
  const [ story, setStory ] = useState(null);

  useEffect(() => {
		const fetchData = async() => {
			const { attributes } = await Auth.currentAuthenticatedUser();
		}
		fetchData();
  }, [])

  const onArrowBack = () => {
		
		navigation.goBack();
	};

  return (
  	<View style={styles.container}>
  		<View style={styles.headContainer} >
				<TouchableOpacity onPress={onArrowBack} style={[styles.iconStyle, {marginLeft: 10}]}>
					<Image source={require("../../assets/navIcon/arrowBackW.png")} style={styles.iconStyle} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}> Report a Problem</Text>
			</View>
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
export default ReportProblem;