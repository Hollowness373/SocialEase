import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, } from 'react-native';
import { User } from '../../models';
import { Auth, DataStore, Predicates} from "aws-amplify";
import { S3Image } from "aws-amplify-react-native";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { set } from 'react-native-reanimated';


const dummy_img = "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";
const profilePictureWidth = Dimensions.get("window").width * 0.3;
const profileTopPosition = Dimensions.get("window").height / 7;

const SearchHeader = ({ numPosts, onSort, userId}) => {

    const [user, setUser] = useState(null);
    const [ numFollowers, setNumFollowers ] = useState(0);
    const [ numFollowing,  setNumFollowing ] = useState(0);

    const { height, width} = Dimensions.get("window");

    useEffect(() => {
        
        const fetchUser = async() => {


            //console.log("userData: ", userData);
            //console.log("userId: ", userId);

            const dbUser = await DataStore.query(User, userId);
            if (!dbUser) {
                Alert.alert("User is not found!");
            } else {
                //setUser(dbUser);
                const subscription = DataStore.observeQuery(User, (s) => s.id.eq(userId)).subscribe(({items}) => items.map(i => setUser(i)))
                return () => subscription.unsubscribe();
                
            }
            
        }
        fetchUser();
      }, []);


    const onFollow = () => {
        console.log("Follow");
    };
    const onMessage = () => {
        console.log("Message: ",user);
    };
    const onSortBy = () => {
        onSort();
    }

    return (
        <>
    	    <View style={[styles.container,{ height: height / 2}]}> 
                {/* Cover */}
                    {user?.cover ? (
                        <S3Image imgKey={user?.cover} style={{width: "100%", height: height/ 4.5}}/>
                    ) : (
                        <Image source={require("../../../assets/defaultCover.png")} style={{width: "100%", height: height/ 4.5}}/>
                    )}
                {/* Profile Picture */}
                    {user?.image ? (
                        <S3Image imgKey={user?.image} style={styles.image} />
                    ) : (
                        <Image source={{uri: dummy_img}} style={styles.image} />
                    )}
                <View style={styles.dataContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.txtUserName}>{user?.name}</Text>
                    </View>
                    
                    <View style={styles.statsContainer}>
                        <View style={{alignItems:"center"}}>
                            <Text style={styles.numData}>{numPosts}</Text>
                            <Text style={styles.txtData}>posts</Text>
                        </View>
                        <View style={{alignItems:"center"}}>
                            <Text style={styles.numData}>{numFollowers}</Text>
                            <Text style={styles.txtData}>followers</Text>
                        </View>
                        <View style={{alignItems:"center"}}>
                            <Text style={styles.numData}>{numFollowing}</Text>
                            <Text style={styles.txtData}>following</Text>
                        </View>
                        
                    </View>
                </View>
                <View style={styles.btnsContainer}>
                    <TouchableOpacity onPress={onFollow} style={styles.btnOnFollow}>
                        <LinearGradient
                            colors={['#8DEAED', '#42C9D8']}
                            style={styles.btnGradient}
                        >
                            <Text style={styles.btnText}>Follow</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <View style={{width:"5%"}} />
                    <TouchableOpacity onPress={onMessage} style={styles.btnOnMessage}>                    
                            <Text style={[styles.btnText,{color:"#42C9D8"}]}>Message</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flexDirection:"row"}}>
                <Text style={styles.sectionTitle}>Posts</Text>
                <View style={styles.sortContainer}>
                    <TouchableOpacity onPress={onSortBy} style={styles.sortBtnContainer}>
                        <Text style={styles.txtSort}>Sort by</Text>
                        <Image source={require("../../../assets/sortIcon.png")} style={{height:15, width:15}} />
                    </TouchableOpacity>
                </View>
            </View>
            
        </>
    )
};


const styles = StyleSheet.create({
    container:{
    	width:"100%",
    },
    // COVER PHOTO
    userCover: {
        width: "100%",
        height: 150,
    },
    image: {
        width: profilePictureWidth,
        aspectRatio: 1,
        borderRadius: 500,
        borderWidth: 5,
        borderColor: "white",
        position:"absolute",
        marginLeft: 20,
        top: profileTopPosition,
    },
    // USER DATA
    dataContainer: {
        flex:1, 
        alignItems:"center", 
        flexDirection:"row"
    },
    nameContainer: {
        height:"100%",
        width:"40%", 
        alignItems:"center"
    },
    statsContainer: {
        height:"100%",
        width:"60%", 
        justifyContent:"space-evenly", 
        alignItems:"center", 
        flexDirection:"row",
    },
    numData: {
        color:"#FFF", 
        fontSize:20
    },
    txtData: {
        color:"#FFF", 
        fontSize:16
    },
    // OTHERS
    sectionTitle: {
      marginLeft: 10,
      marginVertical: 5,
      fontWeight: "500",
      fontSize: 18,
      color: "#FFF"
    },
    btnsContainer: {
        flex:1, 
        flexDirection: "row" ,
        alignItems: "center", 
        justifyContent:"space-evenly",
    },
    btnOnFollow: {
      height: 40,
      width: "35%", 
    },
    btnGradient: {
        height: 40,
        width: "100%", 
        justifyContent:"center", 
        alignItems:"center",
        borderRadius: 10,
    },
    btnOnMessage:{
        height: 40,
        width: "35%",
        borderColor: "#42C9D8",
        borderWidth:1,
        borderRadius: 10,
        alignItems:"center",
        justifyContent:"center"
    },
    btnText: {
        fontSize: 16, 
        fontStyle: "italic",
        fontWeight: "600",
    },
    txtUserName: {
        color:"#FFF", 
        fontWeight: "700", 
        fontSize: 20, 
        marginLeft: profilePictureWidth / 3, 
        bottom:10, 
        position:"absolute"
    },
    sortContainer: { 
        flexDirection:"row",
        alignItems:"center", 
        marginLeft:"auto", 
        marginRight:10,
    },
    sortBtnContainer: {
        alignItems:"center", 
        flexDirection:"row"
    },
    txtSort: {
        color:"#FFF", 
        fontWeight:"500", 
        marginRight: 10
    },

});
export default SearchHeader;