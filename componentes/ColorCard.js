import { View, Pressable } from 'react-native';
import styles from './styles'
import React from 'react';

function ColorCard({keys, color, onClick, flash }) {
    return (
        <Pressable key={keys} onPress= {onClick} >
           <View key={keys} style={[styles.box, { backgroundColor:  (flash)? "black" : `${color}` , borderColor: (flash) ? 'black' : 'white' }]} />
       </Pressable>

    );
  }
  
  export default ColorCard