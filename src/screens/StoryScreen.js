import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import UserStoryContent from '../components/UserStoryContent';
import stories from "../../assets/data/Stories.json";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const StoryScreen = () => {

	const navigation = useNavigation();
	const route = useRoute();
	const { userId } = route.params;

	
	const [ storyIndex, setStoryIndex ] = useState(0)
	const [ user, setUser ] = useState(stories.find( u => u.id == userId));
	const [ story, setStory] = useState(user?.fleets?.items[storyIndex]);
	const listNumber = user?.fleets?.items.length;
	const progressItems = user?.fleets.items;
	

	useEffect(() => {

		let userIndex = -1;
		for (let i = 0; i < stories?.length; i++) {
			if (stories[i].id == user.id)  {
				userIndex = i;
				break;
			}
		}
		if (storyIndex >= user?.fleets?.items.length) {
			// Show Next Story
			if (stories.length > userIndex + 1) {
				setUser(stories[userIndex + 1]);
				setStoryIndex(0);
			} else {
				navigation.navigate("TabScreens");
			}
		} 
		else if (storyIndex < 0) {
			// Show Previous Story
			if (userIndex > 0) {
				setUser(stories[userIndex - 1]);
				setStoryIndex(stories[userIndex - 1].fleets.items.length - 1);
			} else { 
				setStoryIndex(0);
			}
		} 
		else {
			setStory(user?.fleets?.items[storyIndex]);
		}
	}, [storyIndex]);

	const showNextStory = () => {
		setStoryIndex(storyIndex + 1);	
	}
	const showPrevStory = () => {
		setStoryIndex(storyIndex - 1);
	}
	const funcTesting = () => {
		console.log("Test Success!");
	}

    return (
    	<UserStoryContent 
			user={user} 
			story={story} 
			showNextStory={showNextStory} 
			showPrevStory={showPrevStory} 
			progressItems={progressItems} 
			listNumber={listNumber}
			funcTesting={funcTesting}
		/>
    )
};


const styles = StyleSheet.create({
    container:{
    	flex:1,
    	justifyContent: 'center',
    	alignItems: 'center',
    }
});
export default StoryScreen;