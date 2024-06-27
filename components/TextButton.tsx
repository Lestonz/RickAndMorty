import { StyleSheet, Text, View, TouchableOpacity, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native'
import React from 'react'


interface TextButtonInterface {
    label: string;
    customContainerStyle?: ViewStyle;
    customLabelStyle?: TextStyle;
    onPress: () => void;
    icon?:boolean;
    iconSource?: number;
    customIconStyle?: ImageStyle;
}

const TextButton:React.FC<TextButtonInterface> = ({label, customContainerStyle, customLabelStyle, onPress, icon, iconSource, customIconStyle}) => {
  return (
    <TouchableOpacity
        style={{
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            backgroundColor: 'grey',
            flexDirection:'row',
       
            ...customContainerStyle
        }}
        onPress={onPress}
    >
      <Text style={{...customLabelStyle}} >{label}</Text>
      {   icon && 
                <Image 
                    source={iconSource}
                    resizeMode="cover"
                    style={{
                        height:25,
                        width:25,
                        ...customIconStyle
                    }}
                />
            }
    </TouchableOpacity>
  )
}

export default TextButton

const styles = StyleSheet.create({})