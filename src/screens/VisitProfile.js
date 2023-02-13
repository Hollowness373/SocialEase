import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList} from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { DataStore, Predicates, SortDirection } from "aws-amplify";
import { User, Post } from '../models';
import FeedPost from '../components/FeedPost';
import SearchHeader from '../components/Search/SearchHeader';

const VisitProfile = () => {

    const navigation = useNavigation();
    const route = useRoute();
	const [posts, setPosts] = useState([]);
	const [ sort, setSort ] = useState(true);

    useEffect(() => {
        const fetchUser = async() => {
			const userId = route?.params?.userId;
			const dbUser = await DataStore.query(User, userId);
			if (!dbUser) {
				Alert.alert("User is not found!")
			} else {
				const subscription = DataStore.observeQuery(Post, (pst) => pst.postUserId.eq(userId), {
				sort: (s) => s.createdAt(sort? SortDirection.DESCENDING : SortDirection.ASCENDING)}).subscribe(({items}) => setPosts(items));
			  	return () => subscription.unsubscribe();
			}
		  }
		  fetchUser();
    }, [sort])

    const onArrowBack = () => {
		navigation.goBack();
	};

	const onSort = () => {
		setSort(sort? false : true);
	  }

  return (
  	<View style={styles.container}>
  		<View style={styles.headContainer} >
				<TouchableOpacity onPress={onArrowBack} style={[styles.iconStyle, {marginLeft: 10}]}>
					<Image source={require("../../assets/navIcon/arrowBackW.png")} style={styles.iconStyle} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{route?.params?.userName}'s Profile</Text>
		</View>
		<FlatList 
            data={posts}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <FeedPost post={item}/>}
			ListHeaderComponent={ <SearchHeader numPosts={posts.length} onSort={onSort} userId={route?.params?.userId} />}
			
		/>
  	</View>
  )
};


const styles = StyleSheet.create({
  container: {
		flex: 1,
		backgroundColor: "#00040F",
	},
	// HEADER
	headContainer: {
		backgroundColor:"#00040F",
		flexDirection: "row",
		alignItems:"center",
		width:"100%",
		height: "8%",
	},
	iconStyle: {
		height: 30, 
		width: 30,
	},
	headerTitle: {
		color:"#FFF",
		fontSize: 20,
		fontStyle:"italic",
		marginLeft: 10
	},
});
export default VisitProfile;