import { Image, View, Text, StyleSheet } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';

const Stamp = ({
  stampImage,
  stamp,
  number,
  facilityName,
  facilityprofile,
}) => {
  return (
    <>
      {facilityName && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ ...GlobalStyles.profileImage2, marginTop: 5, marginRight: 15 }}
            contentFit="cover"
            source={facilityprofile}
          />
          <Text
            style={{ ...GlobalStyles.body, marginRight: 10 }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {facilityName}
          </Text>
        </View>
      )}
      <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 30 }}>
        {stamp.map((item, index) => (
          <View style={{ width: '20%', height: 100, alignItems: 'center' }}>
            <Image
              source={stampImage}
              style={{
                ...styles.stamp,
                tintColor: index >= number ? Color.darkgray : null,
              }}
            />
            <Text style={{ textAlign: 'center' }}>{item}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  stamp: {
    width: 40,
    height: 40

  }
})

export default Stamp;
