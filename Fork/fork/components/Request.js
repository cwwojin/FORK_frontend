import { useState } from 'react';
import { Image, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import Translator, {
  TranslatorProvider,
  useTranslator,
} from 'react-native-translator';

const Request = ({
  facilityImage,
  facilityName,
  facilityAddress,
  state,
}) => {

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'flex-start',
          paddingTop: 5,
        }}>
        <Image
          style={{...GlobalStyles.squareImage2, marginBottom: 0}}
          contentFit="cover"
          source={facilityImage}
        />
        <View style={{ width: '75%', paddingVertical: 10 }}>
          <Text
            style={{
              ...GlobalStyles.body,
              paddingHorizontal: 30,
              marginLeft: -10,
            }}>
            {facilityName}
          </Text>
          <View style={{padding: 5}}/>
          <Text
            style={{
              ...GlobalStyles.body2,
              paddingHorizontal: 30,
              marginLeft: -10,
            }}>
            {facilityAddress}
          </Text>
        </View>
      </View>

      <Text
        style={{
          ...GlobalStyles.h4,
          paddingHorizontal: 20,
          textAlign: 'right'
        }}>
        {state}
      </Text>

      <View
        style={{
          borderBottomColor: Color.lightGrey,
          borderBottomWidth: 1,
          marginVertical: 10,
        }}
      />
    </View>
  );
};

export default Request;
