import { Image, View, Text } from 'react-native';
import {GlobalStyles}  from '../GlobalStyles.js';

const SquareFacility = ({
  facilityImage,
  facilityScore,
  facilityName,
  facilityAddress,
}) => {
  if (facilityImage == undefined) {
    facilityImage = require('../assets/placeholders/long_image.png');
  };

  return (
    <View>
      <Image
        style={GlobalStyles.squareImage}
        contentFit="cover"
        source={Number.isInteger(facilityImage) ? facilityImage : { uri: facilityImage }}
      />
      <View style={{ marginLeft: 15, marginRight: 15, width: 110 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}>
          <Text
            style={GlobalStyles.body}
            numberOfLines={1}
            ellipsizeMode="tail">
            {facilityName}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Image
              style={GlobalStyles.icon}
              contentFit="cover"
              source={require('../assets/icons/star.png')}
            />
            <Text style={GlobalStyles.body3}>{facilityScore? facilityScore : '-'}</Text>
          </View>
        </View>
        <Text style={GlobalStyles.body2} numberOfLines={1} ellipsizeMode="tail">
          {facilityAddress}
        </Text>
      </View>
    </View>
  );
};

export default SquareFacility;
