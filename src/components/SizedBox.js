import React from 'react';
import {View} from 'react-native';

const SizedBox = ({height, width}) => {
    return (
    	<View style={{height: height, width: width}}></View>
    )
};
export default SizedBox;