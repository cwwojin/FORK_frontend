import * as React from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import NumericInput from 'react-native-numeric-input';


import { GlobalStyles, Color } from '../GlobalStyles';
import Review from '../components/Review';
import { getReviewByQuery, getFacilityByID, USERID, sendStampTransaction } from './api';


const GiveStamp = () => {
  //Get Informations of facilities
  //All the reviews [facility_img, facility_name, score(int), date(string), review_img, review_content, hashtags(Array)]

  const navigation = useNavigation();
  const route = useRoute();
  const { userID, facilityID } = route.params;

  const [addStamp, setAddStamp] = useState({value : 0});
  const [useStamp, setUseStamp] = useState({value : 0});

  const sendTransaction = async () => {
    const amount = addStamp.value - useStamp.value;
    const type = (amount > 0) ? 1 : 0;
    try {
      const data = await sendStampTransaction(userID, facilityID, type, Math.abs(amount));
      console.log(data);
      Alert.alert("Success", "Transaction successful!");
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during the transaction.");
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <View style={GlobalStyles.content}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={GlobalStyles.icon}
              source={require('../assets/icons/navigate_left.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -27,
              paddingBottom: 10,
            }}>
            <Text style={GlobalStyles.h1}>Give Stamps</Text>
          </View>
        </View>

        <View style={{ paddingTop: '40%', height: '60%', }} >
          <Text style={GlobalStyles.h3}>Number of Stamps to give: </Text>
          <NumericInput
            value={addStamp.value}
            minValue={0}
            maxValue={9}
            onChange={value => setAddStamp({ value })}
            onLimitReached={(isMax, msg) => console.log(isMax, msg)}
            totalWidth={240}
            totalHeight={50}
            iconSize={25}
            rounded
            textColor={Color.black}
            iconStyle={{ color: Color.white }}
            editable={false}
            leftButtonBackgroundColor={Color.orange_700}
            rightButtonBackgroundColor={Color.orange_700}
          />
          <View style={{ padding: 20 }} />
          <Text style={GlobalStyles.h3}>Number of Stamps to use: </Text>
          <NumericInput
            value={useStamp.value}
            minValue={0}
            maxValue={9}
            onChange={value => setUseStamp({ value })}
            onLimitReached={(isMax, msg) => console.log(isMax, msg)}
            totalWidth={240}
            totalHeight={50}
            iconSize={25}
            rounded
            editable={false}
            textColor={Color.black}
            iconStyle={{ color: Color.white }}
            leftButtonBackgroundColor={Color.orange_700}
            rightButtonBackgroundColor={Color.orange_700}
          />
        </View>
        <TouchableOpacity onPress={sendTransaction}>
          <Text style={{ ...GlobalStyles.h1, color: Color.orange_700 }}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GiveStamp;
