import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Dimensions, Animated} from 'react-native';
import ProfilePicture from './ProfilePicture';
import moment from 'moment/moment';





const UserStoryContent = ({ user, story, showNextStory, showPrevStory, progressItems, listNumber}) => {

    const [ heart, isHeart ] = useState(false);

    const screenWidth = Dimensions.get("window").width;
    const [progressAnims, setProgressAnims] = useState(useRef(new Animated.Value(0)).current);

    
    
    useEffect(() => {

        Animated.timing(
          progressAnims,
          {
            toValue: (screenWidth - 20),
            duration: 5000,
            useNativeDriver: false
          }
        ).start(function onComplete() {
           yikes();
        });
        const yikes = () => {
            showNxtStory();
        }
      }, [progressAnims]);


    const onHeartPressed = () => {
        isHeart(heart? false : true);
    }

    const showPreviousStory = () => {
        Animated.timing(progressAnims).stop();
        showPrevStory();
        setProgressAnims(new Animated.Value(0));
        
    }
    const showNxtStory = () => {
        Animated.timing(progressAnims).stop();
        showNextStory();
        setProgressAnims(new Animated.Value(0));
        
    }



    return (
    	<View style={styles.container}>
            {story.image && <Image source={{uri: story.image}} style={styles.imageStyle} /> }
            {story.text && <Text style={styles.txtStyle}>{story.text}</Text>}
            <View style={styles.headerContainer}>
                <View style={{width:"100%", flexDirection:"row", backgroundColor:"#bbb"}}>
                    <FlatList
                        data={progressItems}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={() => 
                            <View style={[styles.containerProgress,{width: screenWidth}]}>
    		                    <View style={{flex:1, width:"100%", backgroundColor:"#bbb"}}>
                                    <Animated.Text style={{backgroundColor: '#fff', width: progressAnims}}></Animated.Text>
                                </View>
    	                    </View>
                        }
                    />
                </View>
                <View style={{height:5}}></View>
                <View style={styles.profileHeaderContainer}>
                    <ProfilePicture image={user.image} />
                    <View style={styles.userNamesContainer}>
                        <Text style={styles.nameStyle}>{user.name}</Text>
                        <Text style={styles.userContentTime}>{moment(story.createdAt).fromNow()}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.navStoryContainer}>
                <TouchableOpacity style={styles.prevStoryBTN} onPress={showPreviousStory} />
                <TouchableOpacity style={styles.nextStoryBTN} onPress={showNxtStory} />
            </View>
            {/*
            <View style={styles.footerContainer}>
                <TextInput placeholder='Send Comment..' placeholderTextColor="#e8e8e8" style={styles.commentInput} />
                <TouchableOpacity onPress={onHeartPressed} style={styles.btnStyle}>
                    <Image source={heart ? require("../../assets/storyIsHeart.png") : require("../../assets/storyHeart.png")} style={styles.heartIcon}/>
                </TouchableOpacity>
            </View>
            */}
    	</View>
    )
};


const styles = StyleSheet.create({
    container:{
    	flex:1,
    	justifyContent: 'center',
    	alignItems: 'center',
        backgroundColor: "#4d535e",
    },
    txtStyle: {
        fontSize: 25,
        color: "#e8e8e8",
        fontWeight:"bold",
        textAlign:"center",
        margin: 20
    },
    imageStyle: {
        width:"100%",
        height: "100%",
        resizeMode: "cover"
    },
    headerContainer:{
        width: "100%",
        //flexDirection:"row",
        alignItems:"center",
        position:"absolute",
        top: 0,
        padding: 20,
    },
    profileHeaderContainer:{
        width: "100%",
        flexDirection:"row",
        alignItems:"center",
    },
    userNamesContainer:{
        flexDirection:"row",
        marginLeft: 10
    },
    nameStyle:{
        color: "#e8e8e8",
        fontWeight:"bold",
    },
    userContentTime:{
        color: "#e8e8e8",
        marginLeft: 10
    },
    // STORY NAVIGATION
    navStoryContainer: {
        height: "100%",
        width: "100%",
        flexDirection:'row',
        position:"absolute" , 
    },
    prevStoryBTN: {
        height: "100%",
        width:"30%", 
    },
    nextStoryBTN: {
        height: "100%",
        width:"70%", 
    },
    // FOOTER
    footerContainer: {
        height: "10%", 
        width:"100%", 
        position:"absolute", 
        bottom: 0, 
        flexDirection:"row", 
        alignItems:"center", 
        paddingLeft:20, 
        paddingRight:20, 
        justifyContent:"space-between"
    },
    commentInput: {
        height: "80%", 
        width:"75%", 
        borderWidth:1,
        borderColor:"#e8e8e8", 
        borderRadius: 50, 
        padding: 20,
    },
    btnStyle:{
        height:"80%", 
        width:"10%", 
        alignItems:"center", 
        justifyContent:"center"
    },
    heartIcon:{
        height: 35, 
        width: 35
    },
    // ProgressBar
    containerProgress:{
    	height:3,
    	//backgroundColor:"red",
        borderWidth:.5,
        //borderColor:"white",
    },
    progressStyle: {
        backgroundColor:"black",
        height: 3, 
        
    }
});
export default UserStoryContent;