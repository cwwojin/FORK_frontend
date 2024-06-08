import { Image, View, Text, StyleSheet } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles.js';
import { useEffect, useState } from 'react';
import { getFacilityByID, fetchImage, getFacilityStampRuleByID, LOGIN } from '../screens/api.js';

import userImage from '../assets/placeholders/User.png';
import stampImagePlaceholder from '../assets/icons/stamp.png';

const Stamp = ({
  stampImage,
  stamp,
  number,
  facilityID
}) => {

  const [facilityprofile, setFacilityprofile] = useState();
  const [facilityInfo, setFacilityInfo] = useState();
  const [stampLogo, setStampLogo] = useState(stampImage ? stampImage : stampImagePlaceholder);
  const [stampRule, setStampRule] = useState(stamp ? stamp : []);

  useEffect(() => {
    const fetchFacilityInfo = async () => {
      try {
        const data = await getFacilityByID(facilityID);
        setFacilityInfo(data);

        if (data.profile_img_uri) {
          const imageUrl = await fetchImage(data.profile_img_uri);
          setFacilityprofile(imageUrl);
        }

        const stamps = await getFacilityStampRuleByID(facilityID);

        if (stamps.logo_img_uri) {
          const stampImage = await fetchImage(stamps.logo_img_uri);
          if (stampImage != undefined) {
            setStampLogo({ uri: stampImage });
          }
        }

        if (stamps.rewards) {
          const maxCnt = Math.max(...stamps.rewards.map(reward => reward.cnt));
          const newStampRule = Array(maxCnt).fill('');
          stamps.rewards.forEach(reward => {
            newStampRule[reward.cnt - 1] = reward?.name;
          });
          setStampRule(newStampRule);
          console.log(newStampRule);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (facilityID) { fetchFacilityInfo(); };
  }, []);

  return (
    <>
      {facilityID && !stampRule && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ ...GlobalStyles.profileImage2, marginTop: 5, marginRight: 15 }}
            contentFit="cover"
            source={facilityprofile ? { uri: facilityprofile } : userImage}
          />
          <Text
            style={{ ...GlobalStyles.body, marginRight: 10 }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {facilityInfo?.name}
          </Text>
        </View>
      )}
      <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 30 }}>
        {stampRule.map((item, index) => (
          <View key={index} style={{ width: '20%', height: 100, alignItems: 'center' }}>
            <Image
              source={stampLogo ? stampLogo : stampImage}
              style={{
                ...styles.stamp,
                opacity: index >= number ? 0.2 : 1,
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
