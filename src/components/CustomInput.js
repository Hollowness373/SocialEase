import React, {useState} from 'react';
import {View, Image, TextInput, StyleSheet} from 'react-native';

const CustomInput = ({ source, value, placeholder, onChangeText, secureTextEntry}) => {


    return (
    	<View style={styles.container}>
            <Image source={source} style={styles.iconStyle} />
    		<TextInput 
                value={value}
                placeholder={placeholder} 
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                textAlign="center"
                placeholderTextColor="#e8e8e8"
                style={styles.inputStyle}/>
            <View style={styles.iconStyle}></View>
    	</View>
    )
};

const styles = StyleSheet.create({
    container: {
        justifyContent:"center",
        alignItems: "center",
        width: "100%",
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "white",
        marginBottom: 21,
        flexDirection:"row",
        paddingLeft:10,
        
        
    },
    inputStyle: {
        color:"white",
        fontStyle: "italic",
        width:"80%",
        height: 40,
    },
    iconStyle:{
        height:28, 
        width: 28
    }
})

export default CustomInput;