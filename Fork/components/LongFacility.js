import { Image, View, Text } from 'react-native';
import { GlobalStyles } from '../GlobalStyles.js';

const LongFacility = ({
  facilityImage,
  facilityScore,
  facilityName,
  facilityAddress,
  facilityState,
}) => {
  if (facilityImage == undefined) {
    facilityImage = require('../assets/placeholders/long_image.png');
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Image
        style={{ ...GlobalStyles.longImage, marginTop: 5 }}
        contentFit="cover"
        source={Number.isInteger(facilityImage) ? facilityImage : { uri: facilityImage }}
      />
      <View style={{ marginLeft: 20, marginRight: 20, width: '95%' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <Text
              style={{ ...GlobalStyles.body, marginRight: 10 }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {facilityName}
            </Text>
            <Text style={GlobalStyles.body2}>{facilityState}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Image
              style={GlobalStyles.icon}
              contentFit="cover"
              source={require('../assets/icons/star.png')}
            />
            <Text style={GlobalStyles.body3}>{facilityScore}</Text>
          </View>
        </View>
        <Text style={{ ...GlobalStyles.body2, marginBottom: 18 }} numberOfLines={1} ellipsizeMode="tail">
          {facilityAddress}
        </Text>
      </View>
    </View>
  );
};

export default LongFacility;
