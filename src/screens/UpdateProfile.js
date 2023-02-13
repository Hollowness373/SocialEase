import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Auth, API, graphqlOperation, DataStore, Storage } from "aws-amplify";
import { User } from '../models';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { S3Image } from "aws-amplify-react-native";
import * as ImagePicker from "expo-image-picker";
import CustomInput from "../components/CustomInput";
import { LinearGradient } from 'expo-linear-gradient';

const dummy_img = "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";

const createUser = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      createdAt
      updatedAt
      name
      image
      _version
      _lastChangedAt
      _deleted
    }
  }
`;

const UpdateProfile = () => {

	const [ name, setName ] = useState("")
    const [ user, setUser ] = useState(null)
    const [	image, setImage ] = useState(null);

  	const navigation = useNavigation();

	useEffect (() => {
        const fetchUser = async () => {
          const userData = await Auth.currentAuthenticatedUser();
          const dbUser = await DataStore.query(User, userData.attributes.sub);
          setUser(dbUser);
          setName(dbUser.name);
          //console.log("USER: ",user);
          //console.log("Name: ",name);
        }
    
        fetchUser();
    }, []);

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
        // If Authenthicated User already exist or link in database...
        if (user) {
            // Update User Information.
        await onUpdate();
        } else {
            // Create a New User.
        await onCreate();
      	} 
      	navigation.goBack();
    }

	const onCreate = async () => {
        const userData = await Auth.currentAuthenticatedUser();
        
        const newUser = {
          id: userData.attributes.sub,
          name,
          _version: 1,
        };
        if (image) {
          newUser.image = await uploadFile(image);
        }
        await API.graphql(graphqlOperation(createUser, {input: newUser}));
      };
    const onUpdate = async () => {
        let imgKey = "";
        if (image) {
          imgKey = await uploadFile(image);
        }
        await DataStore.save(User.copyOf(user, (updated) => {
          updated.name = name;
          if (imgKey) {
            updated.image = imgKey;
          }
        }));
      };

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.Images,
		  allowsEditing: true,
		  aspect: [4, 3],
		  quality: 1,
		});
	
		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};


	let renderImage = <Image source={{uri: dummy_img}} style={styles.image} />;
	if (image) {
		renderImage = <Image source={{uri: image}} style={styles.image} />;
	} else if (user?.image) {
		renderImage = <S3Image imgKey={user.image} style={styles.image} />;
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
				<Text style={styles.headerTitle}> Edit Profile</Text>
				<View style={styles.btnContainer}>
					<TouchableOpacity onPress={onSave} style={styles.btnStyle}>
						<LinearGradient colors={['#8DEAED', '#42C9D8']} style={styles.btnGradient}>
							<Text>Save</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
		</View>
		<View style={{flex:1,}}>
			<View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
				<TouchableOpacity onPress={pickImage} style={{alignItems:"center"}}>
					{renderImage}
					<Image source={require("../../assets/navIcon/uploadImageB.png")} style={styles.iconStyles} />
				</TouchableOpacity>
				
			</View>
			<View style={styles.inputContainer}>
				<CustomInput value={name} onChangeText={setName} />
			</View>
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
	// Profile
	image: {
		width: "50%",
		aspectRatio: 1,
		borderRadius: 500,
	},
	iconStyles: {
		height: 40, 
		width:40, 
		position:"absolute", 
		right:"5%", 
		bottom:0,
	},
	// USER NAME
	inputContainer: {
		flex:1, 
		alignItems:"center", 
		padding: 20
	}

});
export default UpdateProfile;