import React, {useCallback, useImperativeHandle} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import { Auth } from 'aws-amplify';
import { useNavigation } from "@react-navigation/native";

const BottomSheetView = React.forwardRef(({setIsActive}, btmSheetRef) => {


    const { height, width} = Dimensions.get("window");
    const maxSheetVal = -height;
    const navigation = useNavigation();

    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0});
    const activeStatus = useSharedValue(false)
    
    const updateActivity = () => {
        setIsActive(false);
    }

    const scrollToVal = useCallback((destinationVal) => {
        "worklet";
        activeStatus.value = destinationVal !== 0 ;
        translateY.value = withSpring(destinationVal, {damping: 17});
        if (destinationVal === 0 ) {
            runOnJS(updateActivity)()
        }
    }, []);

    const btmSheetStatus = useCallback(() => {
        return activeStatus.value;
    }, [])

    useImperativeHandle(btmSheetRef, () => ({scrollToVal, btmSheetStatus}), [scrollToVal, btmSheetStatus])
    
    const gesture = Gesture.Pan()
    .onStart(() => {
        context.value = { y: translateY.value }
    })
    .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, maxSheetVal);
    })
    .onEnd(() => {
        if (translateY.value > -height + (height/5)) {
            scrollToVal(0);
        } else if (translateY.value < -height + (height/5)) {
            scrollToVal(maxSheetVal)
        }
        
    });
    
    const bottomSheetAnimation = useAnimatedStyle(() => {
        return {
            transform: [{translateY: translateY.value}],
        }
    })

    const onOutPress = () => {
        scrollToVal(0);
    };
    const onCoverChange = () => {
        scrollToVal(0);
        navigation.navigate("UpdateCover");
    };
    const onEditProfile = () => {
        scrollToVal(0);
        navigation.navigate("UpdateProfile");
    };
    const onReportProblem = () => {
        scrollToVal(0);
        navigation.navigate("ReportProblem");
    };
    const onLogOut = () => {
        scrollToVal(0);
        Auth.signOut();
    };
  

    return (
        <GestureDetector gesture={gesture}>
    	    <Animated.View style={[styles.container, {height: height,top:height}, bottomSheetAnimation]}>
                <TouchableOpacity onPress={onOutPress} style={{flex:1}} />
                <View style={styles.lineContainer}>
                    <View style={styles.line}/>
                </View>
                <View style={styles.sheetContentStyle}>
                    <View style={{flex:1, padding:20}}>
                        <TouchableOpacity onPress={onCoverChange} style={styles.btnStyle}>
                            <Image source={require("../../../assets/navIcon/Cover.png")} style={styles.iconStyle} />
                            <Text style={styles.txtStyle}>Edit Cover</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onEditProfile} style={styles.btnStyle}>
                            <Image source={require("../../../assets/navIcon/changeProfile.png")} style={styles.iconStyle} />
                            <Text style={styles.txtStyle}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onReportProblem} style={styles.btnStyle}>
                            <Image source={require("../../../assets/navIcon/Bug.png")} style={styles.iconStyle} />
                            <Text style={styles.txtStyle}>Report a problem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onLogOut} style={styles.btnStyle}>
                            <Image source={require("../../../assets/navIcon/Logout.png")} style={styles.iconStyle} />
                            <Text style={styles.txtStyles}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:"100%", height:45}} />
                </View>
    	    </Animated.View>
        </GestureDetector>
    )
});


const styles = StyleSheet.create({
    container:{
        width:"100%",
        position:"absolute",
        borderRadius: 25,
    },
    line: {
        backgroundColor: "#FFF",
        height: 4,
        width: 50,
        alignSelf:"center",
        marginVertical: 10,
        borderRadius: 2
    },
    lineContainer: {
        height:30, 
        width:"100%", 
        backgroundColor:"#42C9D8", 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: "center"
    },
    sheetContentStyle: {
        flex:1,
        backgroundColor: "#040B20",
    },
    btnStyle: {
        //backgroundColor: "orange",
        height:"25%",
        alignItems:"center",
        padding: 20,
        marginTop:5,
        flexDirection:"row",
        borderBottomWidth: 1,
        borderBottomColor: "gray"
    },
    txtStyle: {
        color: "#FFF",
        fontSize: 16,
        marginLeft: 20
    },
    txtStyles: {
        color: "#C83939",
        fontSize: 16,
        marginLeft: 20
    },
    iconStyle: {
        height: 30,
        width: 30
    }
});
export default BottomSheetView;