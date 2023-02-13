import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {View, Text, StyleSheet} from 'react-native';
import Navigator from './src/navigation';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Amplify } from 'aws-amplify';
import awsconfig from "./src/aws-exports";
import { AuthProvider } from './src/components/authContext';

Amplify.configure(awsconfig);

function App() {

  

  return (
    <AuthProvider>
  	  <SafeAreaView style={styles.container}>
  		  <Navigator/>
        <StatusBar style='auto'/>
  	  </SafeAreaView>
    </AuthProvider>
  )
};


const styles = StyleSheet.create({
  container:{
  	flex:1,
    backgroundColor: "#00040F"
  }
});
export default App;