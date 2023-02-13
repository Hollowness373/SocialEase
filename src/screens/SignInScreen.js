import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import CustomInput from '../components/CustomInput';
import { Auth } from "aws-amplify";

const SignInScreen = () => {

    const {height, width } = Dimensions.get("window");
    const navigation = useNavigation();
    const [ username, setUsername] = useState("");
    const [ password, setPassword] = useState("");
    const [ loading, setLoading ] = useState(false);

    const onSignIn = async() => {
        if (loading){
            return;
        }

        setLoading(true);
        try {
            await Auth.signIn(username, password);
            //console.log(response);
        } catch (e) {
            Alert.alert('Oops', e.message);
        }
        setLoading(false);
    };

    const createAccountBTN = () => {
        navigation.navigate("SignUpScreen");
    };
    const resetPasswordBTN = () => {
        navigation.navigate("ResetPassword")
    }

    return (
    	<View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.logoStyle}/>
            <LinearGradient
                colors={['#4F4C56', '#171320']}
                start={{ x: 0, y: 0 }}
                style={[styles.formStyle, {height: height * 0.40}]}
            >
                <CustomInput
                    placeholder="Username.."
                    onChangeText={setUsername}
                    source={require("../../assets/userIcon.png")}
                />
                <CustomInput
                    placeholder="Password.."
                    onChangeText={setPassword}
                    source={require("../../assets/passwordIcon.png")}
                    secureTextEntry  
                />
                <TouchableOpacity onPress={resetPasswordBTN} style={styles.forgotPasswordBTN}>
                    <Text style={{fontStyle: "italic", color:"#9B9999"}}>Forgot Password?</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={onSignIn} style={styles.signInBTN}>
                    <LinearGradient
                        colors={['#8DEAED', '#42C9D8']}
                        style={styles.signInBTN}
                    >
                        <Text style={{fontSize: 16, fontStyle: "italic"}}>{loading ? "loading.." : "Sign In"}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
            

            <View style={styles.footerContainer}>
                <View style={styles.footerContent}>
                <Text style={{color: "#e8e8e8", fontStyle:"italic"}}>Don't have an account?  </Text>
                <TouchableOpacity onPress={createAccountBTN}>
                    <Text style={{color:"#4DCEDB", fontStyle:"italic"}}>Create One</Text>
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
    	alignItems:"center",
    },
    logoStyle: {
        height:58, 
        width: 187, 
        marginTop:150, 
        marginBottom: 50
    },
    // FORM
    formStyle:{
        width: "80%",
        borderRadius: 10,
        alignItems:"center",
        paddingTop: 40,
        paddingBottom: 25,
        paddingLeft: 25,
        paddingRight:25
    },
    signInBTN: {
        alignItems:"center", 
        justifyContent: "center",
        height: 40, 
        width: "100%",
        borderRadius: 10,
        position: "absolute",
        bottom: 30
    },
    forgotPasswordBTN: {
        position: "absolute", 
        bottom: 15, 
        height: 30, 
        alignItems:"center", 
        justifyContent:"center",
        paddingRight: 20, 
        paddingLeft: 20
    },
    // FOOTER
    footerContainer: {
        flex:1, 
        alignItems:"center"
    },
    footerContent: {
        flexDirection:"row", 
        bottom:0, 
        position:"absolute", 
        paddingBottom:40
    }

});
export default SignInScreen;