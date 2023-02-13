import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { User } from '../models';
import { Auth, DataStore, Storage } from "aws-amplify";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from "expo-image-picker";
import ProfilePicture from "../components/ProfilePicture";
import ProfilePictureS3 from '../components/ProfilePictureS3';
import { Post } from '../models';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";


const NewPostScreen = () => {

	const [description, setDescription] = useState("");
	const [currUser, setCurrUser] = useState([]);
    const [image, setImage] = useState(null);
	const [ user , setUser] = useState(null)

	const navigation = useNavigation();
	const prof = "https://cdn.myanimelist.net/images/characters/2/451062.jpg"

	useEffect(() => {
		fetchUser();
	}, [])

	const fetchUser = async() => {
		const { attributes } = await Auth.currentAuthenticatedUser();
		setCurrUser(attributes);
		const dbUser = await DataStore.query(User, attributes.sub);
		setUser(dbUser);
		
	}
	const onPost = async() => {

		const newPost = {
			description,
			numberOfLikes: 0,
			numberOfShares: 0,
			postUserId: currUser.sub,
			_version: 1,
		};
  
		if (image) {
			newPost.image = await uploadFile(image);
		}
  
		await DataStore.save(new Post(newPost));

		setDescription("");
		setImage(null);
		navigation.goBack();
	}
	const onArrowBack = () => {
		navigation.goBack();
	};
	const pickImage = async() => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		
		//console.log(result);

    	if (!result.canceled) {
      		setImage(result.assets[0].uri);
    	}

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
	  }

    return (
    	<KeyboardAvoidingView
			 behavior={Platform.OS === "ios" ? "padding" : "height"}
			 style={[styles.container]}
			 contentContainerStyle={{ flex: 1 }}
		>
			<View style={styles.headContainer} >
				<TouchableOpacity onPress={onArrowBack} style={[styles.iconStyle, {marginLeft: 10}]}>
					<Image source={require("../../assets/navIcon/arrowBackW.png")} style={styles.iconStyle} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}> Create post</Text>
			</View>
			<View style={{flex:1, padding:10}}>
				<View style={styles.userProf}>
					{user?.image ? (
						<ProfilePictureS3 image={user?.image} />
					) : (
						<ProfilePicture image={prof} />
					)}
					<Text style={styles.userName}>{user?.name}</Text>
					<TouchableOpacity onPress={pickImage} style={[styles.iconStyle, {marginLeft:"auto"}]}>
						<Image source={require("../../assets/navIcon/imageIcon.png")} style={styles.iconStyle}/>
					</TouchableOpacity>
				</View>
				<TextInput 
					value={description} 
					onChangeText={setDescription} 
					placeholder="What is on your mind?" 
					placeholderTextColor={"#FFF"}
					multiline 
					style={styles.txtDescription}
				/>
				<Image source={{ uri: image }} style={styles.image}/>
				<TouchableOpacity onPress={onPost} style={styles.signInBTN} disabled={!description && !image}>
                    <LinearGradient
                        colors={['#8DEAED', '#42C9D8']}
                        style={styles.signInBTN}
                    >
                        <Text style={{fontSize: 14, fontStyle: "italic"}}>POST</Text>
                    </LinearGradient>
                </TouchableOpacity>
			</View>
    	</KeyboardAvoidingView>
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
	// BODY
	userProf: {
		flexDirection:"row",
		alignItems: "center",
		width: "100%",
		marginBottom:10,
		padding: 10
	},
	userName: {
		fontSize: 16,
		color:"#FFF",
		marginLeft: 10,
		fontWeight: "500"
	},
	txtDescription: {
		color: "#FFF",
		marginBottom: 10,
	},
	image: {
		width: "80%",
		aspectRatio: 4 / 3,
		alignSelf: "center",
	},
	// FOOTER
	signInBTN: {
        alignItems:"center", 
        justifyContent: "center",
		marginTop: "auto",
        height: 40, 
        width: "100%",
        borderRadius: 10,
		marginBottom: 5,
		
    },

});
export default NewPostScreen;