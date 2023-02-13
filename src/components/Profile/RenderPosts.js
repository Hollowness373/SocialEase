import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Entypo, AntDesign, FontAwesome5, MaterialCommunityIcons, } from "@expo/vector-icons"; 
import { DataStore } from 'aws-amplify';
import { S3Image } from "aws-amplify-react-native";
import LikeImage from "../../../assets/images/like.png";
import { User } from '../../models';
import { useNavigation } from "@react-navigation/native";


const dummy_img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";

const FeedPost = ({post}) => {

    const [isLiked, setIsLiked] = useState(false);
    const [user, setUser] = useState("");
    const navigation = useNavigation();
    /*<S3Image imgKey={user?.image} style={styles.profileImage} /> */

    useEffect(() => {
        DataStore.query(User, post.postUserId).then(setUser);
        /*
        const fetchUser = () =>{
            const subscription = DataStore.observeQuery(User, (u) => u.id.eq(post.postUserId))
               .subscribe(({items}) => items.map( i => setUser(i)));
             
            return () => subscription.unsubscribe();
        }
        fetchUser();
        */
        //console.log(user);
    }, [])

    

    return (
    	<View style={styles.post}>
    		{/* HEADER */}
            <TouchableOpacity style={styles.header} onPress={() => {navigation.navigate("Profile")}}>
                {user?.image ? (
                    <S3Image imgKey={user?.image} style={styles.profileImage} />
                    ) : (
                    <Image source={{ uri: dummy_img }} style={styles.profileImage}/>
                    )}
                <View>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.subtitle}>{post?.createdAt}</Text>
                </View>
                <TouchableOpacity style={styles.icon} onPress={() => {console.log("3 dotted clicked!")}}>
                    <Entypo name="dots-three-horizontal" size={18} color="white" />
                </TouchableOpacity>
            </TouchableOpacity>
            {/* BODY */}
            {post.description && (
                <Text style={styles.description}>{post.description}</Text>
            )}
            {post.image && <S3Image imgKey={post.image} style={styles.image}/>}
            {/* Footer */}
            <View style={styles.footer}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <Image source={LikeImage} style={styles.likeIcon} />
              <Text style={styles.likedBy}>Elon Musk and {post.numberOfLikes} others</Text> 
              <Text style={styles.shares}>{post.numberOfShares} shares</Text> 
            </View>
            {/* Buttons Row */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.iconButton} onPress={() => setIsLiked(!isLiked)}>
                <AntDesign name='like2' size={18} color={isLiked? "#5CE1E6" : "#FFF"} />
                <Text style={[styles.iconButtonText, {color: isLiked? "#5CE1E6" : "#FFF"}]}>Like</Text>
              </TouchableOpacity>

              <View style={styles.iconButton}>
                <FontAwesome5 name='comment-alt' size={18} color="#FFF" />
                <Text style={styles.iconButtonText}>Comment</Text>
              </View>

              <View style={styles.iconButton}>
                <MaterialCommunityIcons name='share-outline' size={18} color="#FFF" />
                <Text style={styles.iconButtonText}>Share</Text>
              </View>
            </View>
        </View>
            
    	</View>
    )
};


const styles = StyleSheet.create({
    container:{
    	flex:1,
    	justifyContent: 'center',
    	alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
    },
    post: {
        width:"100%",
        marginVertical: 10,
        backgroundColor: "#00040F",
    },
    header: {
        width:"100%",
        flexDirection:"row",
        alignItems:"center",
        padding:10
    },
    name: {
        fontWeight:"500",
        color: "#FFF"
    },
    subtitle: {
        color: "gray"
    },
    icon: {
        marginLeft: "auto",
        width: 30,
        alignItems: "center"

    },
    description: {
        paddingHorizontal: 10,
        lineHeight: 20, 
        letterSpacing: 0.3,
        color:"#FFF"
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        marginTop: 10,
    },
    //Footer
    footer: {
        paddingHorizontal: 10,
    },
    statsRow: {
        paddingVertical: 10,
        flexDirection:"row",
    },
    likeIcon: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    likedBy: {
        color: "gray"
    },
    shares: {
        marginLeft: "auto",
        color: "gray"
    },
    //Buttons Row
    buttonsRow:{
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    iconButton:{
        flexDirection: "row",
        alignItems:"center"
    },
    iconButtonText: {
        marginLeft: 5,
        color: "#FFF",
        fontWeight: "500",
    },

});
export default FeedPost;