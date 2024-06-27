/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';

import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,

  StatusBar,
  StyleSheet,
  Text,

  useColorScheme,
  View,
} from 'react-native';
import axios from 'axios'
import CheckBox from '@react-native-community/checkbox';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import TextButton from './components/TextButton';



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    location: {
      name: string;
      url: string
    },
    image: string
  }

  interface ApiResponse {
    results: Character[];
  }

  const [data, setData] = useState<ApiResponse | null>(null);
  const [filteredData, setFilteredData] = useState<Character[]>([]);
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [statusFilters, setStatusFilters] = useState<{ [key: string]: boolean }>({});
  const [locationsFilters, setLocationsFilters] = useState<{ [key: string]: boolean }>({});


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };



  const apiRickAndMorty = async (setData: (data: ApiResponse) => void) => {
    try {
      const response = await axios.get<ApiResponse>("https://rickandmortyapi.com/api/character");
      setData(response.data);
    } catch (error) {
      console.log("Error from data", error)
    }

  }
  const applyFilters = () => {
    if (data) {
      let filtered = data.results;

      const activeStatusFilters = Object.keys(statusFilters).filter(key => statusFilters[key]);
      if (activeStatusFilters.length > 0) {
        filtered = filtered.filter(character => activeStatusFilters.includes(character.status));
      }

      const activeLocationsFilters = Object.keys(locationsFilters).filter(key => locationsFilters[key]);
      if (activeLocationsFilters.length > 0) {
        filtered = filtered.filter(character => activeLocationsFilters.includes(character.location.name));
      }

      setFilteredData(filtered);
    }
  }



  useEffect(() => {
    apiRickAndMorty(setData);
  }, []);

  useEffect(() => {
    if (data) {

      const uniqueStatuses = Array.from(new Set(data.results.map(character => character.status)));
      const initialFilters: { [key: string]: boolean } = {};
      uniqueStatuses.forEach(status => {
        initialFilters[status] = false;
      });

      setStatusFilters(initialFilters);

      const uniqueLocations = Array.from(new Set(data.results.map(character => character.location.name)));
      const initialLocationsFilters: { [key: string]: boolean } = {};
      uniqueLocations.forEach(loc => {
        initialLocationsFilters[loc] = false;
      });


      setLocationsFilters(initialLocationsFilters);

    }
  }, [data]);

  useEffect(() => {
    applyFilters();
  }, [data, statusFilters, locationsFilters]);

  const handleStatusChange = (status: string) => {
    setStatusFilters(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const handleLocationsChange = (status: string) => {
    setLocationsFilters(prev => ({ ...prev, [status]: !prev[status] }));
  };


  const renderCardList = () => {
    return (

      <View style={{
        width: Dimensions.get('screen').width
      }} >
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={filteredData}
          renderItem={({ item, index }) => {
            return (
              <View
                key={index}
                style={{
                  width: "90%",
                  alignSelf: "center",
                  borderColor: "#7F7F7F",
                  borderWidth: 0.7,
                  paddingVertical: 5,
                  marginVertical: 5,
                  borderRadius: 10
                }}
              >
                <View style={{ flexDirection: 'row' }} >
                  <Image
                    style={{ width: '35%', height: 120, borderRadius: 10, margin: 5 }}
                    source={{ uri: item?.image }}
                  />
                  <View style={{ width: '65%', justifyContent: 'space-between', marginLeft: 10 }} >
                    <Text style={{ fontSize: 18, fontWeight: 600, color: 'blue', overflow: 'hidden', maxWidth: '90%' }} >
                      {item?.name}
                    </Text>
                    <View style={{ flexDirection: 'row' }} >
                      <Text>Status: </Text>
                      <Text style={{ fontSize: 14, fontWeight: 600, }} >
                        {item?.status}
                      </Text>
                    </View>
                    <View>
                      <Text>Last known location:</Text>
                      <Text style={{ marginTop: 5, marginBottom: 5, fontWeight: 600, fontSize: 14, overflow: 'hidden', maxWidth: '90%' }} >
                        {item?.location?.name}
                      </Text>
                    </View>

                  </View>
                </View>
              </View>
            )
          }}
        />
      </View>
    )
  }


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ width: "90%", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: '5%' }} >
        <TextButton label='Sort By' customContainerStyle={{ width: "45%" }} customLabelStyle={{color:"white", fontSize:16, fontWeight:600}} onPress={() => console.log("Hello Short By!")} />
        <TextButton label='Filter' customContainerStyle={{ width: "45%" }} customLabelStyle={{color:"white", fontSize:16, fontWeight:600}} onPress={() => setModalFilterVisible(true)} />

      </View>
      <Modal
        visible={modalFilterVisible}
        transparent={true}
        onRequestClose={() => setModalFilterVisible(false)}
      >
        <View style={{
          flex: 1,
          marginTop: '25%',
          paddingLeft: '5%',
          paddingTop: '5%',
          backgroundColor: '#d3d3d3'
        }} >
          <View style={{
            width: 300,
          }} >
            <Text style={{ fontSize: 20, fontWeight: 700 }} >Filter Characters</Text>
            {
              Object.keys(statusFilters).map((status, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, }} >
                  <CheckBox
                    value={statusFilters[status]}
                    onValueChange={() => handleStatusChange(status)}
                  />
                  <Text style={{ fontSize: 16, marginLeft: 10, fontWeight: 600 }} >{status}</Text>
                </View>
              ))
            }

            <Text style={{ fontSize: 20, fontWeight: 700 }} >Filter Locations</Text>
            {
              Object.keys(locationsFilters).map((status, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, }} >
                  <CheckBox
                    value={locationsFilters[status]}
                    onValueChange={() => handleLocationsChange(status)}
                  />
                  <Text style={{ fontSize: 16, marginLeft: 10, fontWeight: 600 }} >{status}</Text>
                </View>
              ))
            }
          </View>
          <TextButton label='Close' customContainerStyle={{ width: "45%" }} onPress={() => setModalFilterVisible(false)} />
        </View>

      </Modal>
      {renderCardList()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
