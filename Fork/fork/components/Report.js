import { useState } from 'react';
import { Image, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';

const Report = ({
  userImage,
  userName,
  reportDate,
  reportContent,
}) => {

  const reportHandled = () => { };


  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',

        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{
              ...GlobalStyles.profileImage2,
              marginTop: 5,
              marginRight: 15,
            }}
            contentFit="cover"
            source={userImage}
          />

          <Text
            style={GlobalStyles.body}
            numberOfLines={1}
            ellipsizeMode="tail">
            {userName}
          </Text>
        </View>
        <Text
          style={{ ...GlobalStyles.body2 }}
          numberOfLines={1}
          ellipsizeMode="tail">
          {reportDate}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          paddingLeft: 70,
          paddingBottom: 20,
        }}>
          <Text
            style={GlobalStyles.body4}>
            {reportContent}
          </Text>
      </View>

      <TouchableOpacity onPress={reportHandled} style={{alignSelf: 'flex-end'}}>
        <Text style={GlobalStyles.h4}>Fixed</Text>
      </TouchableOpacity>

      <View
        style={{
          borderBottomColor: Color.lightGrey,
          borderBottomWidth: 1,
          alignSelf: 'stretch',
          marginBottom: 10,
        }}
      />
    </View>
  );
};

export default Report;
