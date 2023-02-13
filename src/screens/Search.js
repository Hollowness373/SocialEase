import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList} from 'react-native';
import { DataStore, Predicates } from 'aws-amplify';
import { User } from "../models";
import SearchList from '../components/Search/SearchList';
import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";

const Search = () => {

    const [ searchInput, setSearchInput ] = useState("");
    const [ users, setUsers ] = useState();

    useEffect(() => {
        if (searchInput === "") {
            setUsers();
            return;
        }
        const fetchUsers = async() => {
            const dbUsers = await DataStore.query(User, (i) => i.name.beginsWith(searchInput));
            setUsers(dbUsers);
        }
        fetchUsers();
    }, [searchInput])
    

    return (
    	<View style={styles.container}>
  		    <View style={styles.headContainer} >
                <View style={styles.searchContainer}>
                    <Image source={require("../../assets/searchIcon.png")} style={styles.iconStyle} />
    		            <TextInput 
                            placeholder={"Search"} 
                            onChangeText={setSearchInput}
                            textAlign="center"
                            placeholderTextColor="#e8e8e8"
                            style={styles.inputStyle}/>
                    <View style={styles.iconStyle}></View>
    	        </View>
		    </View>
            <FlatList 
                data={users}
                renderItem={({item}) => <SearchList userImage={item.image} userName={item.name} userId={item.id}/>}
            />
  	    </View>
    )
};


const styles = StyleSheet.create({
    container: {
		flex: 1,
		backgroundColor: "#040B20",
	},
	// HEADER
	headContainer: {
		backgroundColor:"#00040F",
		alignItems:"center",
        justifyContent:"center",
		width:"100%",
		height: "8%",
        padding:20
	},
    searchContainer: {
        justifyContent:"center",
        alignItems: "center",
        width: "100%",
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "white",
        flexDirection:"row",
        paddingLeft:10,
        
        
    },
    inputStyle: {
        color:"white",
        fontStyle: "italic",
        width:"80%",
        height: 40,
    },
    iconStyle:{
        height:28, 
        width: 28
    }
})
export default Search;