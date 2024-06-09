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
import { FacilityDetails } from './MapViewFunctions';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';
import { getNewestFacilities, getTrendingFacilities, LOGIN, USERPREFERENCE, getTrendingPreferenceFacilities } from './api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getLanguageToken, getAllTranslations } from '../LanguageUtils';


const Home = () => {

  useEffect(() => {
    if (!LOGIN) {navigation.replace("SignUpLogIn")};
  }, LOGIN);

  //Get Informations of facilities
  //img url for ad, Top 5 trending facilities [img_url, name, score, address], Top 5 new failities, Recommendation of 2 restaurants
  const [trending, setTrending] = useState([]);
  const [newest, setNewest] = useState([]);
  const [preference, setPreference] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [translations, setTranslations] = useState({
    trending: '',
    new: '',
    foodiePicks: '',
    forOur: '',
    dishLovers: '',
    weSuggest: '',
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const fetchedTranslations = await getAllTranslations();
      setTranslations(fetchedTranslations);
    };
    fetchTranslations();
  }, []);

  const getRandomItems = (array, n) => {
    const result = [];
    const length = array.length;
    if (n >= length) return array; // Return the whole array if n is greater or equal to the array length
    const indices = new Set(); // Using a Set to prevent duplicate indices
    while (indices.size < n) {
      indices.add(Math.floor(Math.random() * length)); // Generate random index
    }
    indices.forEach(index => {
      result.push(array[index]); // Push the element corresponding to the index to the result array
    });
    return result;
  };

  useEffect(() => {
    //console.log("userpreference", USERPREFERENCE);

    const fetchTrending = async () => {
      try {
        const data = await getTrendingFacilities();
        setTrending(data);
        fetchNewest();
        fetchPreferences();
      } catch (error) {
        //console.log(error.message);
      }
    };
    const fetchNewest = async () => {
      try {
        const data = await getNewestFacilities();
        //console.log(data);
        setNewest(data);
      } catch (error) {
        //console.log(error.message);
      }
    };
    const fetchPreferences = async () => {
      try {
        const indices = getRandomItems(USERPREFERENCE, 2);

        const suggestedFacilities = {};
        for (const item of indices) {
          const facilityInfo = await getTrendingPreferenceFacilities(item.id);
          suggestedFacilities[item.id] = facilityInfo.length > 0 ? facilityInfo[0] : null;
        }
        setSuggestions(suggestedFacilities);
        setPreference(indices);

        //console.log("suggesting", suggestedFacilities);
      } catch (error) {
        //console.log(error.message);
      }
    };
    fetchTrending();

  }, []);

  const navigation = useNavigation();

  useEffect(() => {
    if (!LOGIN) {navigation.replace("SignUpLogIn")};
  }, LOGIN);

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={GlobalStyles.content}>
          <Image
            style={GlobalStyles.longImage}
            contentFit="cover"
            source={require('../assets/logos/advertisement2.png')}
          />

          <Text style={GlobalStyles.h2}>{translations.trending}</Text>
          <View style={{ ...GlobalStyles.scroll, height: 210 }}>
            <ScrollView
              horizontal
              style={GlobalStyles.scroll}
              showsHorizontalScrollIndicator={false}>
              {trending && trending.map(item => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate("FacilityDetail", { facilityID: item.id });
                }}>
                  <SquareFacility
                    facilityImage={item.profile_img_uri}
                    facilityName={item.name}
                    facilityEnglishName={item.english_name}
                    facilityAddress={item.english_address}
                    facilityKoreanAddress={item.road_address}
                    facilityScore={item.avg_score}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={GlobalStyles.h2}>{translations.new}</Text>
          <View style={{ ...GlobalStyles.scroll, height: 210 }}>
            <ScrollView
              horizontal
              style={GlobalStyles.scroll}
              showsHorizontalScrollIndicator={false}>
              {newest && newest.map(item => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate("FacilityDetail", { facilityID: item.id });
                }}>
                  <SquareFacility
                    facilityImage={item.profile_img_uri}
                    facilityName={item.name}
                    facilityEnglishName={item.english_name}
                    facilityKoreanAddress={item.road_address}
                    facilityAddress={item.english_address}
                    facilityScore={item.avg_score}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={GlobalStyles.h2}>
            {translations.foodiePicks}
          </Text>
          {preference?.map(item => (
            <>
              <Text style={{ ...GlobalStyles.h3, flexDirection: 'row' }}>
                <Text>{translations.forOur}</Text>
                <Text style={{ color: Color.orange_700 }}>{item.name} {translations.dishLovers}</Text>
                <Text>, {translations.weSuggest} ...</Text>
              </Text>
              <View style={{ width: '105%', paddingBottom: 15 }}>
                {suggestions[item.id] && (
                  <FacilityDetails key={item.id} facility={suggestions[item.id]} />
                )}
              </View>
            </>
          ))}
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
