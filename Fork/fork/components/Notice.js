import { Image, View, Text, StyleSheet } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';

const Notice = ({
  facilityImage,
  facilityName,
  noticeDate,
  noticeImage,
  noticeContent,
}) => {
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '95%',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ ...GlobalStyles.profileImage2, marginTop: 5, marginRight: 15 }}
            contentFit="cover"
            source={facilityImage}
          />
          <Text
            style={{ ...GlobalStyles.body, marginRight: 10 }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {facilityName}
          </Text>
        </View>
        <Text
          style={{ ...GlobalStyles.body2, marginRight: 10 }}
          numberOfLines={1}
          ellipsizeMode="tail">
          {noticeDate}
        </Text>
      </View>

      {noticeImage && (
        <Image
          style={GlobalStyles.longImage}
          contentFit="cover"
          source={noticeImage}
        />
      )}

      {!noticeImage && (
        <View
          style={{height: 10}}
        />
      )}
      <Text style={{ ...GlobalStyles.body4, width: '97%', marginBottom: 18 }}>
        {noticeContent}
      </Text>
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


export default Notice;
