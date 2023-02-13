import React from 'react';
import {Image} from 'react-native';

const ProfilePicture = ({image}) => {

    return (
    	<Image 
            source={{uri: image || ""}}
            style={{
                height: 40,
                width: 40,
                borderRadius: 20
            }}
        />
    )
};

export default ProfilePicture;