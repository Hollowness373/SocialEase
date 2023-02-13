import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/CustomInput';
import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";

const ResetPassword = () => {

    const [ username, setUsername ] = useState("");
    const { height, width } = Dimensions.get("window");
    const navigation =  useNavigation();

    const onSend = async() => {
        try {
            await Auth.forgotPassword(username);
            navigation.navigate("ResetingPassword", {username});
        } catch (e) {
            Alert.alert('Oops', e.message);
        }
    };

    const signInBTN = () => {
        navigation.navigate("SignInScreen");
    };
    

    return (
    	<View style={styles.container}>
            <LinearGradient
                colors={['#4F4C56', '#171320']}
                start={{ x: 0, y: 0 }}
                style={[styles.formStyle, {height: height * .35}]}
            >
                <Text style={styles.txtDescription}>RESET YOUR PASSWORD</Text>
                <Text style={styles.txtInstruction}>Code will be sent to your email.</Text>

                <CustomInput 
                    placeholder="Username.."
                    onChangeText={setUsername}
                    source={require("../../assets/userIcon.png")}
                />
                <TouchableOpacity onPress={onSend} style={styles.sendBTN}>
                    <LinearGradient
                        colors={['#8DEAED', '#42C9D8']}
                        style={styles.sendBTN}
                    >
                        <Text style={{fontSize: 16, fontStyle: "italic"}}>Send</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={signInBTN} style={styles.bckSignIn}>
                        <Text style={{fontStyle: "italic", color:"#9B9999", fontSize: 12}}>Back to Sign In</Text>
                </TouchableOpacity>

            </LinearGradient>
    		
    	</View>
    )
};


const styles = StyleSheet.create({
    container:{
    	flex:1,
    	backgroundColor: "#00040F",
    	alignItems:"center",
        justifyContent:"center"
    },
    // FORM
    formStyle:{
        width: "80%",
        borderRadius: 10,
        alignItems:"center",
        paddingTop: 20,
        paddingBottom: 25,
        paddingLeft: 25,
        paddingRight:25
    },
    txtDescription:{
        color:"#4DCEDB", 
        fontStyle:"italic",
        fontSize: 18,
        fontWeight:"600"
    },
    txtInstruction: {
        color:"#9B9999",
        fontStyle: "italic",
        fontSize: 8,
        marginTop: 20,
        marginBottom: 10,
    },
    sendBTN: {
        alignItems:"center", 
        justifyContent: "center",
        height: 40, 
        width: "100%",
        borderRadius: 10,
        position: "absolute",
        bottom: 30
    },
    bckSignIn: {
        position:"absolute",
        bottom: 15,
    }

});
export default ResetPassword;