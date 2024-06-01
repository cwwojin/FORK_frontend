import * as React from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Color, GlobalStyles } from '../GlobalStyles';
import SquareFacility from '../components/SqureFacility';
import LongFacility from '../components/LongFacility';
import NavigationBar from '../components/NavigationBar';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';
import { getNewestFacilities, getTrendingFacilities, fetchImage } from './api';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Home = () => {
  //Get Informations of facilities
  //img url for ad, Top 5 trending facilities [img_url, name, score, address], Top 5 new failities, Recommendation of 2 restaurants
  const [trending, setTrending] = useState([]);
  const [trendingImageList, setTrendingImageList] = useState([]);
  const [newest, setNewest] = useState([]);
  const [newestImageList, setNewestImageList] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingFacilities();
        setTrending(data);

        const newTrendingImageList = {};
        for (const item of data) {
          if (item.profile_img_uri) {
            const imageUrl = await fetchImage(item.profile_img_uri);
            newTrendingImageList[item.id] = imageUrl;
          } else {
            newTrendingImageList[item.id] = longImagePlaceholder;
          }
        }
        console.log(newTrendingImageList);
        setTrendingImageList(newTrendingImageList);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchNewest = async () => {
      try {
        const data = await getNewestFacilities();
        console.log(data);
        setNewest(data);

        const newNewestImageList = {};
        for (const item of data) {
          if (item.profile_img_uri) {
            const imageUrl = await fetchImage(item.profile_img_uri);
            newNewestImageList[item.id] = imageUrl;
          } else {
            newNewestImageList[item.id] = longImagePlaceholder;
          }
        }
        setNewestImageList(newNewestImageList);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchTrending();
    fetchNewest();
  }, []);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={GlobalStyles.content}>
          <Image
            style={GlobalStyles.longImage}
            contentFit="cover"
            source={require('../assets/placeholders/long_image.png')}
          />

          <Text style={GlobalStyles.h2}>Trending</Text>
          <View style={{ ...GlobalStyles.scroll, height: 210 }}>
            <ScrollView
              horizontal
              style={GlobalStyles.scroll}
              showsHorizontalScrollIndicator={false}>
              {trending.map(item => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate("FacilityDetail", { facilityID: item.id });
                }}>
                  <SquareFacility
                    facilityImage={trendingImageList[item.id]}
                    facilityName={item.name}
                    facilityAddress={item.english_address}
                    facilityScore={item.avg_score}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={GlobalStyles.h2}>New</Text>
          <View style={{ ...GlobalStyles.scroll, height: 210 }}>
            <ScrollView
              horizontal
              style={GlobalStyles.scroll}
              showsHorizontalScrollIndicator={false}>
              {newest.map(item => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate("FacilityDetail", { facilityID: item.id });
                }}>
                  <SquareFacility
                    facilityImage={newestImageList[item.id]}
                    facilityName={item.name}
                    facilityAddress={item.english_address}
                    facilityScore={item.avg_score}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={GlobalStyles.h2}>
            Foodie picks
          </Text>
          <Text style={{ ...GlobalStyles.h3, flexDirection: 'row' }}>
            <Text>For our </Text>
            <Text style={{ color: Color.orange_700 }}>meat lovers</Text>
            <Text>, we suggest ...</Text>
          </Text>
          <LongFacility
            facilityImage={longImagePlaceholder}
            facilityName={'steak house'}
            facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
            facilityScore={'-'}
            facilityState={'Open'}
          />
          <Text style={{ ...GlobalStyles.h3, flexDirection: 'row' }}>
            <Text>For our </Text>
            <Text style={{ color: Color.orange_700 }}>sushi lovers</Text>
            <Text>, we suggest ...</Text>
          </Text>
          <LongFacility
            facilityImage={longImagePlaceholder}
            facilityName={'eoeun sushi'}
            facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
            facilityScore={'-'}
            facilityState={'Open'}
          />
        </View>
      </ScrollView>

      <NavigationBar
        homeb={true}
        mapb={false}
        favoritesb={false}
        myPageb={false}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default Home;
