import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/CustomInput';
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Auth } from "aws-amplify";

const ConfirmAccScreen = () => {
    const route = useRoute();
    const routeValue = route?.params?.username;
    const navigation = useNavigation();
    const { height, width } = Dimensions.get("window");
    const [ username, setUsername ] = useState(routeValue);
    const [ cnfrmCode, setCfrmCode ] = useState("");


    const resendCodeBTN = async() => {
        try {
            await Auth.resendSignUp(username);
            Alert.alert("Resend Code: ", "Code was sent to your email!");
        } catch (e) {
            Alert.alert('Oops', e.message);
        }
    };
    const confirmBTN = async() => {
        try {
            await Auth.confirmSignUp(username, cnfrmCode);
            navigation.navigate("SignInScreen");
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
                style={[styles.formStyle, {height: height * .45}]}
            >
                <Text style={styles.txtDescription}>CONFIRM SIGN UP</Text>
                <Text style={styles.txtInstruction}>Enter the code we sent to your email.</Text>
                <CustomInput 
                    value={username}
                    placeholder="Username.."
                    onChangeText={setUsername}
                    source={require("../../assets/userIcon.png")}
                />
                <CustomInput 
                    placeholder="Confirmation Code.."
                    onChangeText={setCfrmCode}
                    source={require("../../assets/securityIcon.png")}
                />
                
                <View style={styles.bottomForm}>
                    <View style={styles.btnsContainer}>
                        <TouchableOpacity onPress={resendCodeBTN} style={styles.resendCodeBTN}>
                            <Text style={{fontStyle: "italic", color:"#42C9D8",fontSize:12}}>Resend Code</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmBTN} style={styles.confirmBTN}>
                            <LinearGradient
                                colors={['#8DEAED', '#42C9D8']}
                                style={styles.gradientStyle}
                            >
                                <Text style={{fontStyle: "italic", fontSize:12}}>Confirm</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={signInBTN} style={styles.bckSignIn}>
                        <Text style={{fontStyle: "italic", color:"#9B9999", fontSize: 12}}>Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
    		
    	</View>
    )
};


const styles = StyleSheet.create({
    container:{
    	flex:1,
        backgroundColor: "#00040F",
    	justifyContent: 'center',
    	alignItems: 'center',
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
    bottomForm:{
        flex:1,
        alignItems: "center"
    },
    bckSignIn:{
        position: "absolute",
        bottom: 0,
    },
    // BUTTON ROW
    btnsContainer:{
        flexDirection: "row",
        width:"100%",
        justifyContent:"space-between",
        position:"absolute",
        bottom: 0,
        marginBottom: 40,
    },
    resendCodeBTN:{
        left: 0,
        borderColor: "#42C9D8",
        borderWidth:1,
        borderRadius: 10,
        padding:5,
        width: "47%",
        alignItems:"center",
        justifyContent:"center"

    },
    confirmBTN: {
        borderRadius: 10,
        width: "47%",
        alignItems:"center",
        justifyContent:"center"
    },
    gradientStyle: {
        width: "100%",
        alignItems:"center",
        borderRadius: 10,
        padding: 5,
        
    }

});
export default ConfirmAccScreen;