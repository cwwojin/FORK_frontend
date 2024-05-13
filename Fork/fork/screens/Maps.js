import * as React from 'react';
import { Text, View, Image, SafeAreaView, ScrollView } from 'react-native';
import { Color, GlobalStyles } from '../GlobalStyles';
import SquareFacility from '../components/SqureFacility';
import LongFacility from '../components/LongFacility';
import NavigationBar from '../components/NavigationBar';
import { Map } from 'react-kakao-maps-sdk';
import useKakaoLoader from '../useKakaoLoader';

//To be deleted
import longImagePlaceholder from '../assets/placeholders/long_image.png';

const Maps = () => {
  //Get Informations of facilities
  //img url for ad, Top 5 trending facilities [img_url, name, score, address], Top 5 new failities, Recommendation of 2 restaurants

  useKakaoLoader();

  return (
    <SafeAreaView style={GlobalStyles.background}>
      <Map // 지도를 표시할 Container
        id="map"
        center={{
          // 지도의 중심좌표
          lat: 33.450701,
          lng: 126.570667,
        }}
        style={{
          // 지도의 크기
          width: '100%',
          height: '100%',
        }}
        level={3} // 지도의 확대 레벨
      />
    </SafeAreaView>
  );
};

export default Maps;
