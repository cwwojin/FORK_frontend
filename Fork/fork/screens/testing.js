import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';

const testing = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch('https://taqjpw7a54.execute-api.ap-southeast-2.amazonaws.com/stage-001/s3/fork-foodies/images%2F2024-05-18%2F1716012725953_IMG_1951.png', {
          method: 'GET',
          headers: {
            'Accept': 'image/png',
          },
        });

        if (response.ok) {
          const imageUrl = response.url;
          setImageUrl(imageUrl);
          console.log(imageUrl);
        } else {
          setError('Failed to fetch image');
        }
      } catch (error) {
        setError('An error occurred: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageUrl && (
        <>
          <Text>My Image</Text>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        </>

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default testing;
