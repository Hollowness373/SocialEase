import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/CustomInput';
import { useNavigation } from "@react-navigation/native";
import { Auth } from 'aws-amplify';

const SignUpScreen = () => {
    const { height, width } = Dimensions.get("window");
    const navigation = useNavigation();
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPass, setConfirmPass ] = useState("");
    const [ name, setName ] = useState("");

    const onRegister = async() => {
        if (password == confirmPass) {
            // If passwords matched -> Proceed to signup.
            try {
                await Auth.signUp({
                    username,
                    password,
                    attributes:{email, name, preferred_username: username,}
                });
                navigation.navigate("ConfirmAccScreen", {username});
    
            } catch (e) {
                Alert.alert('Oops', e.message);
            }
        } else {
            Alert.alert("Error!","The passwords you entered do not match.");
        };
    };
    const signInBTN = () => {
        navigation.navigate("SignInScreen");
    };

    return (
    	<View style={styles.container}>
            <Image source={require("../../assets/logoName.png")} style={[styles.logoName,{marginTop: height / 8}]}/>
            <LinearGradient
                colors={['#4F4C56', '#171320']}
                start={{ x: 0, y: 0 }}
                style={[styles.formStyle, {height: height * 0.65}]}
            >
                <Text style={styles.txtDescription}> Create an account</Text>
                <CustomInput 
                    placeholder="Name.."
                    onChangeText={setName}
                    source={require("../../assets/nameIcon.png")}
                />
                <CustomInput 
                    placeholder="Username.."
                    onChangeText={setUsername}
                    source={require("../../assets/userIcon.png")}
                />
                <CustomInput 
                    placeholder="Email.."
                    onChangeText={setEmail}
                    source={require("../../assets/emailIcon.png")}
                />
                <CustomInput 
                    placeholder="Password.."
                    onChangeText={setPassword}
                    source={require("../../assets/passwordIcon.png")}
                    secureTextEntry
                />
                <CustomInput 
                    placeholder="Confirm Password.."
                    onChangeText={setConfirmPass}
                    source={require("../../assets/passwordIcon.png")}
                    secureTextEntry
                />

                <TouchableOpacity onPress={onRegister} style={styles.registerBTN}>
                    <LinearGradient
                        colors={['#8DEAED', '#42C9D8']}
                        style={styles.registerBTN}
                    >
                        <Text style={{fontSize: 16, fontStyle: "italic"}}>Register</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
            <View style={styles.footerContainer}>
                    <View style={styles.footerContent}>
                        <Text style={{color: "#e8e8e8", fontStyle:"italic"}}>Have an account?  </Text>
                        <TouchableOpacity onPress={signInBTN}>
                            <Text style={{color:"#4DCEDB", fontStyle:"italic"}}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
            </View>
    	</View>
    )
};


const styles = StyleSheet.create({
    container:{
    	flex:1,
        backgroundColor: "#00040F",
    	alignItems: 'center',
    },
    logoName: {
        height: 25,
        width: 113,
        marginBottom: 50,
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
    txtDescription: {
        fontStyle: "italic", 
        color:"#e8e8e8",
        marginBottom: 20,
    },
    registerBTN: {
        alignItems:"center", 
        justifyContent: "center",
        height: 40, 
        width: "100%",
        borderRadius: 10,
        position: "absolute",
        bottom: 20
    },
    // FOOTER
    footerContainer:{
        flex:1,
        alignItems:"center"
    },
    footerContent:{
        flexDirection: "row",
        position:"absolute",
        bottom:0,
        paddingBottom: 40
    }
});
export default SignUpScreen;