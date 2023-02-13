import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, StyleSheet, Dimensions, Alert, FlatList, } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Post, User } from '../models';
import { Auth, DataStore, Predicates, SortDirection, } from "aws-amplify";
import FeedPost from '../components/FeedPost';
import BottomSheetView from '../components/BottomSheet/BottomSheetVIew';
import ProfileHeader from '../components/Profile/ProfileHeader';


const Profile = () => {

    const [ isActive, setIsActive] = useState(false);
    const [posts, setPosts] = useState([]);
    const [ sort, setSort ] = useState(true);
    const { height, width } =  Dimensions.get("window");
    const btmSheetRef = useRef(null);

    useEffect(() => {

      const fetchUser = async() => {

        const userData = await Auth.currentAuthenticatedUser();
        const userId = userData.attributes.sub;
        

        const dbUser = await DataStore.query(User, userId);
        if (!dbUser) {
          Alert.alert("User is not found!")
        } else {
          //DataStore.query(Post, (pst) => pst.postUserId.eq(userId)).then(setPosts);
          const subscription = DataStore.observeQuery(Post, (pst) => pst.postUserId.eq(userId), {
            sort: (s) => s.createdAt(sort? SortDirection.DESCENDING : SortDirection.ASCENDING)}).subscribe(({items}) => setPosts(items));
          return () => subscription.unsubscribe();
        }
      }
      fetchUser();
    }, [sort]);

    const onPress = () => {
      onToggle();
      setIsActive(true);
    }

    const onSort = () => {
      setSort(sort? false : true);
    }

    const onToggle = useCallback(() => {
      const btmSheetStatus = btmSheetRef?.current?.btmSheetStatus();
      if (btmSheetStatus) {
          btmSheetRef?.current?.scrollToVal(0);
      } else {
          btmSheetRef?.current?.scrollToVal(-height);
      }
      
  }, []);

    
    return (
      <GestureHandlerRootView style={{flex:1  }}>
    	<View style={styles.container}>
    
          <FlatList 
            data={posts}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <FeedPost post={item}/>}
            ListHeaderComponent={ <ProfileHeader onClick={onPress} isActive={isActive} numPosts={posts.length} onSort={onSort} />}
          />
        </View> 
        <BottomSheetView ref={btmSheetRef} setIsActive={setIsActive} />
      </GestureHandlerRootView>
    )
};


const styles = StyleSheet.create({
    container:{
    	flex:1,
      backgroundColor: "#00040F",
    },
});
export default Profile;