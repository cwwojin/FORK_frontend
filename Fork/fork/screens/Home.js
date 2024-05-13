import * as React from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles';
import SquareFacility from '../components/SqureFacility';
import LongFacility from '../components/LongFacility';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';

const Home = () => {
  //Get Informations of facilities
  //img url for ad, Top 5 trending facilities [img_url, name, score, address], Top 5 new failities, Recommendation of 2 restaurants

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={GlobalStyles.content}>
          <Image
            style={GlobalStyles.longImage }
            contentFit="cover"
            source={require('../assets/placeholders/long_image.png')}
          />

          <Text style={GlobalStyles.h2}>Trending</Text>
          <View style={{ ...GlobalStyles.scroll, height: 210 }}>
            <ScrollView
              horizontal
              style={GlobalStyles.scroll}
              showsHorizontalScrollIndicator={false}>
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'Motiff'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'Malgm'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
            </ScrollView>
          </View>

          <Text style={GlobalStyles.h2}>New</Text>
          <View style={{ ...GlobalStyles.scroll, height: 210 }}>
            <ScrollView
              horizontal
              style={GlobalStyles.scroll}
              showsHorizontalScrollIndicator={false}>
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'Motiff'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'Malgm'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
              <SquareFacility
                facilityImage={longImagePlaceholder}
                facilityName={'yosida'}
                facilityAddress={'21-12 Eoeun-ro 42 and on and on'}
                facilityScore={4.7}
              />
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
    </SafeAreaView>
  );
};

export default Home;
