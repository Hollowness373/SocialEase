import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Auth, DataStore, Predicates, SortDirection } from "aws-amplify";
import SizedBox from "../components/SizedBox";
import UserStoryList from '../components/UserStoryList';
import FeedPost from '../components/FeedPost';
import userposts from "../../assets/data/userspost.json";
import { Post } from "../models";



const Home = () => {

    const [post, setPost] = useState([]);
    const [ curUser, setCurUser ] = useState([])
    
    const navigation = useNavigation();

    useEffect(() => {
        //DataStore.query(Post).then(setPost);
        const subscription = DataStore.observeQuery(Post, Predicates.ALL, {
            sort: (s) => s.createdAt(SortDirection.DESCENDING),
          }).subscribe(({ items }) => setPost(items));

        
          return () => subscription.unsubscribe();
    }, [])


    
    const onLogo = () => {
        //Auth.signOut();
    };
    const onNewPost = async() => {
        navigation.navigate("NewPostScreen");
    };
    const onMessage = () => {
        console.warn("navigate to messaging");
    };


    return (
    	<View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onLogo}>
                    <Image source={require("../../assets/logoName.png")} style={styles.logoStyle}/>
                </TouchableOpacity>
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity onPress={onNewPost}>
                        <Image source={require("../../assets/navIcon/newPost.png")} style={styles.iconStyle}/>
                    </TouchableOpacity>
                    <SizedBox width={20}/>
                    <TouchableOpacity onPress={onMessage}>
                        <Image source={require("../../assets/navIcon/message.png")} style={styles.iconStyle}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex:1, width:"100%"}}>
                <FlatList
                    data={post}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => <FeedPost post={item}/>}
                    ListHeaderComponent={UserStoryList}

                />
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
    // HEADER
    headerContainer: {
        width:"100%", 
        height: 60, 
        flexDirection: "row", 
        padding: 15, 
        alignItems: "center", 
        justifyContent: "space-between"
    },
    iconStyle: {
        height:28, 
        width:28
    },
    logoStyle: {
        height:25, 
        width:113
    },
    // STORY
    storyContainer: {
        height: 100,
        width:"100%",
        backgroundColor: "#040B20",
        paddingLeft: 15,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center"
    },
    storyIcon:{
        height: 55,
        width: 55,
        marginBottom: 5,
        
    },
    nameStyle: {
        color:"#e8e8e8",
        fontSize: 12,
        fontWeight:"bold"
    }
});
export default Home;