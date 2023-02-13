import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput} from 'react-native';
import { User } from '../models';
import { useNavigation } from "@react-navigation/native";
import { Auth, API, graphqlOperation, DataStore, Storage } from "aws-amplify";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { S3Image } from "aws-amplify-react-native";


const dummy_img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";

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
    const [image, setImage] = useState(null);

    const navigation = useNavigation();

    useEffect (() => {
        const fetchUser = async () => {
          const userData = await Auth.currentAuthenticatedUser();
          const dbUser = await DataStore.query(User, userData.attributes.sub);
          setUser(dbUser);
          setName(dbUser.name);
          console.log("USER: ",user);
          console.log("Name: ",name);
        }
    
        fetchUser();
      }, []);

    const onSubmit = async() => {
        // If Authenthicated User already exist or link in database...
        if (user) {
            // Update User Information.
        await onUpdate();
        } else {
            // Create a New User.
        await onCreate();
      } 
      //navigation.goBack();
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
    let renderImage = <Image source={{ uri: dummy_img }} style={styles.image} />;
	  if (image) {
	    renderImage = <Image source={{ uri: image }} style={styles.image} />;
      console.log("yow")
	  } else if (user?.image) {
	    renderImage = <S3Image imgKey={user.image} style={styles.image} />;
	  }


    return (
    	<View style={styles.container}>
            
            {renderImage}
            <Text style={{color:"white", marginBottom:10}}>{name}</Text>
            <TouchableOpacity onPress={pickImage} style={{width: "80%", height: 30, backgroundColor:"red", alignItems:"center", justifyContent:"center", marginBottom: 50}}>
                <Text>PICK IMAGE</Text>
            </TouchableOpacity>

            <TextInput onChangeText={setName} value={name} placeholder={"Enter Username"} />

            <TouchableOpacity onPress={onSubmit} style={{width: "80%", height: 30, backgroundColor:"red", alignItems:"center", justifyContent:"center", marginTop: 50}}>
                <Text>SUBMIT</Text>
            </TouchableOpacity>
            
    	</View>
    )
};


const styles = StyleSheet.create({
    container:{
    	flex:1,
        backgroundColor: "blue",
    	alignItems: 'center',
        justifyContent:"center"
    },
    image: {
        width: "30%",
        aspectRatio: 1,
        marginBottom: 10,
        borderRadius: 500,
        backgroundColor:"red"
      },
});
export default UpdateProfile;