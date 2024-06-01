import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { FontFamily, FontSize, Color, GlobalStyles } from '../GlobalStyles';
import Stamp from '../components/Stamp';

import userImage from '../assets/placeholders/User.png';
import { getStampBook } from './api';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';

const MyStamps = () => {
  const navigation = useNavigation();

  const [userStamp, setUserStamp] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyStamps = async () => {
      try {
        const data = await getStampBook();
        setUserStamp(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStamps();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={GlobalStyles.background}>
        <View style={{...GlobalStyles.content, justifyContent:'center'}}>
          <ActivityIndicator size="large" color={Color.orange_700} />
        </View>
      </SafeAreaView>
    );
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
            }}>
            <Text style={GlobalStyles.h1}>My Stamps</Text>
          </View>
        </View>

        <ScrollView
          style={{
            ...GlobalStyles.scroll,
            overflow: 'hidden',
            marginBottom: -27,
          }}
          showsVerticalScrollIndicator={false}>
          {
            userStamp.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  navigation.navigate("FacilityDetail", { facilityID: item.facility_id });
                }}
              >
                <Stamp
                  number={item.cnt}
                  facilityID={item.facility_id}
                />
                <View
                  style={{
                    borderBottomColor: Color.lightGrey,
                    borderBottomWidth: 1,
                    alignSelf: 'stretch',
                    marginBottom: 15,
                  }}
                />
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyStamps;
