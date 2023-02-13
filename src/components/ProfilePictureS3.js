import React from 'react';
import { S3Image } from "aws-amplify-react-native";

const ProfilePicture = ({image}) => {

    return (
    	<S3Image
            imgKey={image}
            style={{
                height: 40,
                width: 40,
                borderRadius: 20
            }}
        />
    )
};

export default ProfilePicture;