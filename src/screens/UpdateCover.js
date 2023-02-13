import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { Auth, API, graphqlOperation, DataStore, Storage } from "aws-amplify";
import { User } from '../models';
import { S3Image } from "aws-amplify-react-native";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const UpdateCover = () => {


	const [ user, setUser ] = useState(null)
	const [ cover,  setCover ] = useState(null);
	const { height, width } = Dimensions.get("window");
  	const navigation = useNavigation();

	useEffect(() => {

		const fetchUser = async () => {
			const userData = await Auth.currentAuthenticatedUser();
			const dbUser = await DataStore.query(User, userData.attributes.sub);
			setUser(dbUser);
			//console.log("USER: ",user);
		  }
	  
		  fetchUser();

	}, [])

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.Images,
		  allowsEditing: true,
		  aspect: [4, 3],
		  quality: 1,
		});
	
		if (!result.canceled) {
			setCover(result.assets[0].uri);
		}
	};

	let renderCover = <Image source={require("../../assets/defaultCover.png")} style={{width: "100%", height: height/ 4.5}}/>;
	if (cover) {
		renderCover = <Image source={{uri: cover}} style={{width: "100%", height: height/ 4.5}} />;
	} else if (user?.cover) {
		renderCover = <S3Image imgKey={user.cover} style={{width: "100%", height: height/ 4.5}} />;
	}

	const uploadFile = async (fileUri) => {
        try {
            const response = await fetch(fileUri);
            const blob = await response.blob();
            const key = `${uuidv4()}.png`;
            await Storage.put(key, blob, {
                contentType: "image/png", // contentType is optional
            });
            return key;
        } catch (err) {
            console.log("Error uploading file:", err);
        }
    };

	const onSave = async() => {
		let imgKey = "";
        if (cover) {
          imgKey = await uploadFile(cover);
        }
        await DataStore.save(User.copyOf(user, (updated) => {
          if (imgKey) {
            updated.cover = imgKey;
          }
        }));
		navigation.goBack();
	}

	const onArrowBack = () => {
		navigation.goBack();
	};


  	return (
  		<View style={styles.container}>
  			<View style={styles.headContainer} >
				<TouchableOpacity onPress={onArrowBack} style={[styles.iconStyle, {marginLeft: 10}]}>
					<Image source={require("../../assets/navIcon/arrowBackW.png")} style={styles.iconStyle} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}> Edit Cover Photo</Text>
				<View style={styles.btnContainer}>
					<TouchableOpacity onPress={onSave} style={styles.btnStyle}>
						<LinearGradient colors={['#8DEAED', '#42C9D8']} style={styles.btnGradient}>
							<Text>Save</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</View>
			<View style={{flex:1, marginTop:"20%"}}>
				
				<View style={{flexDirection:"row", alignItems:"center", marginBottom: 20}}>
					<Text style={styles.title}>Cover Photo</Text>
					<Text style={styles.titlePrev}>(Preview)</Text>
				</View>

				<TouchableOpacity onPress={pickImage}>
					{renderCover}
					<Image source={require("../../assets/navIcon/uploadImageB.png")} style={styles.iconStyles} />
				</TouchableOpacity>
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
	title: {
		color:"#FFF",
		fontSize: 20,
		marginLeft: 10
	},
	titlePrev: {
		color:"#FFF",
		fontSize: 12,
		marginLeft: 10
	},
	btnContainer: {
		flex:1, 
		alignItems:"center", 
		justifyContent:"center",
	},
	btnStyle:{
		height:"100%", 
		width: "40%",
		justifyContent:"center", 
		marginLeft:"auto", 
		marginRight:10,
	},
	btnGradient: {
        height: 40,
        width: "100%", 
        justifyContent:"center", 
        alignItems:"center",
        borderRadius: 10,
    },
	// BG CONTENT
	iconStyles: {
		height: 40, 
		width:40, 
		position:"absolute", 
		right:0, 
		bottom:0,
	},
});
export default UpdateCover;