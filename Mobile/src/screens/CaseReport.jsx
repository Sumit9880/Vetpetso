import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, StyleSheet, View, TextInput, Image, TouchableOpacity, Modal, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import VectorIcon from '../utils/VectorIcon';
import { apiPost } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import CaseItemReport from '../components/CaseItemReport';
import Loader from '../components/Loader';
import MultiSelectComponent from '../components/MultiSelectComponent';

const CaseReport = () => {
  const user = useSelector(state => state.user.userInfo);
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const [search, setSearch] = useState({
    isOn: false,
    value: '',
    pageIndex: 1
  });
  const [filter, setFilter] = useState({
    isOn: false,
    TALUKA: '',
    DISTRICT: '',
    ANIMAL_BREED: '',
    ANIMAL_TYPE: ''
  })
  const [dropdownData, setDropdownData] = useState({
    breed: [],
    type: [],
    district: [],
    taluka: []
  })

  useEffect(() => {
    if (search.value == '') {
      setSearch({
        isOn: false,
        value: '',
        pageIndex: 1
      });
      setDataSearch([]);
    }
  }, [search.value]);

  const getDataSearch = async () => {
    try {
      if (search.pageIndex == 1) {
        setIsLoading(true);
      }
      const res = await apiPost("api/patientHistory/get", {
        pageIndex: search.pageIndex,
        sortKey: "ID",
        sortValue: "ASC",
        pageSize: 50,
        filter: ` AND MEMBER_ID = ${user.ID} AND (ANIMAL_IDENTITY_NO LIKE '%${search.value}%' OR CASE_NO LIKE '%${search.value}%' OR OWNER_NAME LIKE '%${search.value}%' OR MOBILE_NUMBER LIKE '%${search.value}%')`
      });
      let updatedData = [...dataSearch, ...res.data];
      setDataSearch(updatedData);
      setSearch({ ...search, pageIndex: search.pageIndex + 1, isOn: true });
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async () => {
    try {
      if (pageIndex == 1) {
        setIsLoading(true);
      }
      const res = await apiPost("api/patientHistory/get", {
        pageIndex: pageIndex,
        sortKey: "ID",
        sortValue: "DESC",
        pageSize: 50,
        filter: " AND MEMBER_ID = " + user.ID
      });
      let updatedData = [...data, ...res.data];
      setData(updatedData);
      setPageIndex(pageIndex + 1);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const getDropDownData = async () => {
    try {
      const resDistrict = await apiPost("api/district/get", { filter: ` AND STATUS = 1` });
      const resTaluka = await apiPost("api/taluka/get", { filter: ` AND STATUS = 1` });
      const resBreed = await apiPost("api/animalBreed/get", { filter: ` AND IS_ACTIVE = 1` });
      const resAnimalType = await apiPost("api/animalType/get", { filter: ` AND IS_ACTIVE = 1` });
      setDropdownData({
        breed: resBreed.data,
        type: resAnimalType.data,
        district: resDistrict.data,
        taluka: resTaluka.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setData([]);
      setPageIndex(1);
      setSearch({
        isOn: false,
        value: '',
        pageIndex: 1
      });
      setDataSearch([]);
      getData();
      getDropDownData()
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <Header name="Patient Case Reports" />
      <View style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <VectorIcon type="Feather" name="search" size={22} color="#5a5a5a" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#5a5a5a"
            style={styles.searchInput}
            value={search.value}
            onChangeText={(text) => {
              setSearch({ ...search, value: text });
            }}
            onSubmitEditing={() => getDataSearch()}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, backgroundColor: '#fff', paddingVertical: 5 }}>
          {/* <VectorIcon type="Octicons" name="filter" size={30} color="#4B1AFF" /> */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setFilter({ ...filter, isOn: !filter.isOn })}>
            <Image source={require('../assets/setting.png')} style={{ width: 35, height: 35 }} />
          </TouchableOpacity>
          <Image source={require('../assets/exelfile.png')} style={{ width: 35, height: 35 }} />
          {/* <VectorIcon type="AntDesign" name="export" size={30} color="#4B1AFF" /> */}
        </View>
        <FlatList
          data={search.isOn ? dataSearch : data}
          initialNumToRender={6}
          renderItem={({ item }) => (
            <CaseItemReport item={item} />
          )}
          keyExtractor={item => item.ID}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
          onEndReached={search.isOn ? getDataSearch : getData}
          onEndReachedThreshold={0.1}
        />
      </View>
      <Loader isLoading={isLoading} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={filter.isOn}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ height: '75%', backgroundColor: 'white', padding: 10, borderRadius: 10, paddingVertical: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 0.5 }}>
              <Text style={{ color: "#4B1AFF", fontSize: 20, fontWeight: '600' }}>Filters</Text>
              <VectorIcon type="AntDesign" name="closecircleo" size={26} color="red" onPress={() => setFilter({ ...filter, isOn: false })} />
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center',padding:5 }} showsVerticalScrollIndicator={false}>
              {/* <View > */}
                <MultiSelectComponent
                  label={{ visible: filter.ANIMAL_TYPE ? true : false, text: 'Animal Type' }}
                  value={JSON.parse(filter.ANIMAL_TYPE || '[]')}
                  onChangeText={e => setFilter({ ...filter, ANIMAL_TYPE: JSON.stringify(e) })}
                  options={{}}
                  data={dropdownData.type}
                /><MultiSelectComponent
                  label={{ visible: filter.ANIMAL_BREED ? true : false, text: 'Animal Breed' }}
                  value={JSON.parse(filter.ANIMAL_BREED || '[]')}
                  onChangeText={e => setFilter({ ...filter, ANIMAL_BREED: JSON.stringify(e) })}
                  options={{}}
                  data={dropdownData.breed}
                /><MultiSelectComponent
                  label={{ visible: filter.DISTRICT ? true : false, text: 'District' }}
                  value={JSON.parse(filter.DISTRICT || '[]')}
                  onChangeText={e => setFilter({ ...filter, DISTRICT: JSON.stringify(e) })}
                  options={{}}
                  data={dropdownData.district}
                />
                <MultiSelectComponent
                  label={{ visible: filter.TALUKA ? true : false, text: 'Taluka' }}
                  value={JSON.parse(filter.TALUKA || '[]')}
                  onChangeText={e => setFilter({ ...filter, TALUKA: JSON.stringify(e) })}
                  options={{}}
                  data={dropdownData.taluka}
                />
              {/* </View> */}
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, }}>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 45,
    paddingHorizontal: 20,
    margin: 10,
    borderColor: '#4B1AFF',
    borderWidth: 0.4,
    shadowColor: '#4B1AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default CaseReport;
