import React, {useContext} from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Image,} from 'react-native';
import { NavigationContainer, DarkTheme} from "@react-navigation/native";
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../components/authContext';
import { API, graphqlOperation, DataStore, } from "aws-amplify";
import { User } from '../models';
import Lottie from 'lottie-react-native'

import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ConfirmAccScreen from '../screens/ConfirmAccScreen';
import ResetPassword from '../screens/ResetPassword';
import ResetingPassword from '../screens/ResetingPassword';

import StoryScreen from '../screens/StoryScreen';
import NewPostScreen from '../screens/NewPostScreen';
import Home from "../screens/Home"
import Search from "../screens/Search";
import Notification from "../screens/Notification";
import Profile from "../screens/Profile";
import UpdateProfile from '../screens/UpdateProfile';
import UpdateCover from '../screens/UpdateCover';
import ReportProblem from '../screens/ReportProblem';
import VisitProfile from '../screens/VisitProfile';


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


const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const TabScreens = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: styles.tabNav,}}>
                    <Tab.Screen name='Home' component={Home} 
                        options={{tabBarIcon: ({focused}) => (
                            <View style={styles.tabIconContainer}>
                                <Image 
                                    source={require("../../assets/navIcon/Home.png")}
                                    style={[styles.iconStyle,{tintColor: focused ? "#5CE1E6" : "#e8e8e8",}]}/>
                            </View>
                            )}}/>
                    <Tab.Screen name='Search' component={Search}
                        options={{tabBarIcon: ({focused}) => (
                            <View style={styles.tabIconContainer}>
                                <Image 
                                    source={require("../../assets/navIcon/Search.png")}
                                    style={[styles.iconStyle,{tintColor: focused ? "#5CE1E6" : "#e8e8e8",}]}/>
                            </View>
                            )}}/>
                    <Tab.Screen name='Notification' component={Notification}
                        options={{tabBarIcon: ({focused}) => (
                            <View style={styles.tabIconContainer}>
                                <Image 
                                    source={require("../../assets/navIcon/Notification.png")}
                                    style={[styles.iconStyle,{tintColor: focused ? "#5CE1E6" : "#e8e8e8",}]}/>
                            </View>
                            )}}/>
                    <Tab.Screen name='Profile' component={Profile}
                        options={{tabBarIcon: ({focused}) => (
                            <View style={styles.tabIconContainer}>
                                <Image 
                                    source={require("../../assets/navIcon/Profile.png")}
                                    style={[styles.iconStyle,{tintColor: focused ? "#5CE1E6" : "#e8e8e8",}]}/>
                            </View>
                            )}}/>
        </Tab.Navigator>
    )
}


const Navigator = () =>{

    const { user } = useContext(AuthContext);

    if (user == undefined) {
        return <View style={{flex:1,justifyContent:"center", alignItems:"center"}}><Lottie source={require("../../assets/data/LoaderPhone.json")} autoPlay loop /></View>
    } else if (user) {
        const fetchDataStoreAuth = async() => {
            const dbUser = await DataStore.query(User, user.attributes.sub);
            if (!dbUser) {
                try {
                    const name = user.attributes.preferred_username;
                    const newUser = {
                        id: user.attributes.sub,
                        name,
                        _version: 1,
                    };
                    await API.graphql(graphqlOperation(createUser, {input: newUser}));
                    console.log("Account Created");
                } catch (e) {
                    console.log(e);
                }
                
            }
        }
        fetchDataStoreAuth();
    }
    
    return (
        <NavigationContainer theme={DarkTheme}>
            {user ? (
                <Stack.Navigator screenOptions={{headerShown: false, ...TransitionPresets.SlideFromRightIOS}}>
                    <Stack.Screen name="TabScreens" component={TabScreens} />
                    <Stack.Screen name="StoryScreen" component={StoryScreen} />
                    <Stack.Screen name="NewPostScreen" component={NewPostScreen} />
                    <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
                    <Stack.Screen name="UpdateCover" component={UpdateCover} />
                    <Stack.Screen name="ReportProblem" component={ReportProblem} />   
                    <Stack.Screen name="VisitProfile" component={VisitProfile} />   
                </Stack.Navigator>
            ): (
                <Stack.Navigator  screenOptions={{headerShown: false, ...TransitionPresets.SlideFromRightIOS}}>
                    <Stack.Screen name="SignInScreen" component={SignInScreen} />
                    <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                    <Stack.Screen name="ConfirmAccScreen" component={ConfirmAccScreen} />
                    <Stack.Screen name="ResetPassword" component={ResetPassword} />
                    <Stack.Screen name="ResetingPassword" component={ResetingPassword} />
                    <Stack.Screen name="NewPostScreen" component={NewPostScreen} />
                    
            </Stack.Navigator>
            )}
        </NavigationContainer>
    );
};

export default Navigator;

const styles = StyleSheet.create({
    tabNav: {
        backgroundColor: "#040B20", 
        borderTopWidth: 0, 
        height: 45
    },
    tabIconContainer: {
        alignItems:"center", 
        justifyContent:"center",
    },
    iconStyle: {
        height: 25,
        width: 25,
    }
});