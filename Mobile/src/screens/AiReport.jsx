import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, StyleSheet, View, TextInput, Image, TouchableOpacity, Modal, Text, ToastAndroid, TextBase } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import VectorIcon from '../utils/VectorIcon';
import { apiPost } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import CaseItemReport from '../components/CaseItemReport';
import Loader from '../components/Loader';
import MultiSelectComponent from '../components/MultiSelectComponent';
import DatePick from '../components/DatePick';
import ExportReport from '../components/ExportReport';

const AiReport = () => {
  const user = useSelector(state => state.user.userInfo);
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const [exportData, setExportData] = useState({
    isVisible: false,
    data: {
      api: "api/detailed/aiExport",
      name: "AI_Report"
    }
  });
  const [search, setSearch] = useState({
    isOn: false,
    value: '',
    pageIndex: 1
  });
  const [filter, setFilter] = useState({
    isOn: false,
    TALUKA: [],
    DISTRICT: [],
    ANIMAL_BREED: [],
    ANIMAL_TYPE: [],
    FROM_DATE: '',
    TO_DATE: ''
  })
  let count = filter.TALUKA.length + filter.DISTRICT.length + filter.ANIMAL_BREED.length + filter.ANIMAL_TYPE.length + (filter.FROM_DATE && filter.TO_DATE ? 1 : 0)

  const [dropdownData, setDropdownData] = useState({
    breed: [],
    type: [],
    district: [],
    taluka: []
  })

  useEffect(() => {
    if (search.value == '' && filter.TALUKA.length == 0 && filter.DISTRICT.length == 0 && filter.ANIMAL_BREED.length == 0 && filter.ANIMAL_TYPE.length == 0 && filter.FROM_DATE == '' && filter.TO_DATE == '') {
      setSearch({
        isOn: false,
        value: '',
        pageIndex: 1
      });
      setDataSearch([]);
    }
  }, [search.value]);


  const getDataSearch = async (ind) => {
    let index = ind || search.pageIndex
    try {
      if (search.pageIndex === 1) {
        setIsLoading(true);
      }
      const res = await apiPost("api/detailed/aiReport", {
        pageIndex: index,
        sortKey: "ID",
        sortValue: "ASC",
        pageSize: 50,
        filter: ` AND MEMBER_ID = ${user.ID}` +
          (filter.ANIMAL_BREED.length > 0 ? ` AND BREED IN (${filter.ANIMAL_BREED.join()})` : '') +
          (filter.ANIMAL_TYPE.length > 0 ? ` AND ANIMAL_TYPE IN (${filter.ANIMAL_TYPE.join()})` : '') +
          (filter.DISTRICT.length > 0 ? ` AND DISTRICT IN (${filter.DISTRICT.join()})` : '') +
          (filter.TALUKA.length > 0 ? ` AND TALUKA IN (${filter.TALUKA.join()})` : '') +
          (filter.FROM_DATE && filter.TO_DATE ? ` AND DATE(REGISTRATION_DATE) BETWEEN '${filter.FROM_DATE.replace(/\//g, '-')}' AND '${filter.TO_DATE.replace(/\//g, '-')}'` : '') +
          (search.value ? ` AND (ANIMAL_IDENTITY_NO LIKE '%${search.value}%' OR CASE_NO LIKE '%${search.value}%' OR OWNER_NAME LIKE '%${search.value}%' OR MOBILE_NUMBER LIKE '%${search.value}%')` : '')
      });

      if (res && res.code === 200) {
        let updatedData = []
        if (index === 1) {
          updatedData = res.data;
        } else {
          updatedData = [...dataSearch, ...res.data];
        }
        setSearch({ ...search, pageIndex: index + 1, isOn: true });
        setDataSearch(updatedData);
      } else {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const getData = async () => {
    try {
      if (pageIndex == 1) {
        setIsLoading(true);
      }
      const res = await apiPost("api/detailed/aiReport", {
        pageIndex: pageIndex,
        sortKey: "ID",
        sortValue: "DESC",
        pageSize: 50,
        filter: " AND MEMBER_ID = " + user.ID
      });
      if (res && res.code === 200) {
        let updatedData = [...data, ...res.data];
        setData(updatedData);
        setPageIndex(pageIndex + 1);
      } else {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const getDropDownData = async () => {
    try {
      const resDistrict = await apiPost("api/district/get", { filter: ` AND STATUS = 1` });
      const resTaluka = await apiPost("api/taluka/get", { filter: ` AND STATUS = 1` });
      const resBreed = await apiPost("api/animalBreed/get", { filter: ` AND IS_ACTIVE = 1` });
      const resAnimalType = await apiPost("api/animalType/get", { filter: ` AND IS_ACTIVE = 1` });
      setDropdownData({
        breed: resBreed.data || [],
        type: resAnimalType.data || [],
        district: resDistrict.data || [],
        taluka: resTaluka.data || []
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

  const clearAll = () => {
    setFilter({
      isOn: true,
      TALUKA: [],
      DISTRICT: [],
      ANIMAL_BREED: [],
      ANIMAL_TYPE: [],
      FROM_DATE: '',
      TO_DATE: ''
    })
  }

  const apply = () => {
    setSearch({ ...search, pageIndex: 1 });
    setDataSearch([]);
    getDataSearch(1);
    setFilter({ ...filter, isOn: false })
  }

  return (
    <>
      <Header name="Artificial Insemination Reports" />
      <View style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <VectorIcon type="Feather" name="search" size={22} color="#5a5a5a" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#5a5a5a"
            style={styles.searchInput}
            value={search.value}
            onChangeText={(text) => {
              setSearch({ ...search, value: text, pageIndex: 1 });
            }}
            onSubmitEditing={() => getDataSearch(null)}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, backgroundColor: '#fff', paddingVertical: 5 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.7} onPress={() => setFilter({ ...filter, isOn: !filter.isOn })}>
            <Image source={require('../assets/adjust.png')} style={{ width: 35, height: 35 }} />
            {
              count > 0 &&
              <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#4B1AFF' }}>({count})</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setExportData({ ...exportData, isVisible: true })}>
            <Image source={require('../assets/exelfile.png')} style={{ width: 35, height: 35 }} />
          </TouchableOpacity>
        </View>
        {(search.isOn && dataSearch.length > 0) || (!search.isOn && data.length > 0) ?
          <FlatList
            data={search.isOn || filter.isOn ? dataSearch : data}
            initialNumToRender={6}
            renderItem={({ item }) => (
              <CaseItemReport item={item} color="#ffdbeb" />
            )}
            keyExtractor={item => item.ID}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
            onEndReached={search.isOn ? () => getDataSearch(null) : getData}
            onEndReachedThreshold={0.1}
          />
          :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/empty.png')} style={{ width: 150, height: 150, opacity: 0.5 }} />
          </View>
        }
      </View>
      <Loader isLoading={isLoading} />
      <ExportReport item={exportData.data} showModal={exportData.isVisible} setModal={() => setExportData({ ...exportData, isVisible: false })} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={filter.isOn}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ height: '75%', backgroundColor: 'white', padding: 10, borderRadius: 10, paddingVertical: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 0.5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: "#4B1AFF", fontSize: 20, fontWeight: '600' }}>Filters</Text>
                {
                  count > 0 &&
                  <Text style={{ marginLeft: 10, color: "#4B1AFF", fontSize: 18, fontWeight: '600' }}>({count})</Text>
                }
              </View>
              <VectorIcon type="AntDesign" name="closecircleo" size={26} color="red" onPress={() => setFilter({ ...filter, isOn: false })} />
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center', marginTop: 10, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
              <View style={{ backgroundColor: '#E6F4FE', borderRadius: 10, padding: 10 }}>
                <Text style={{ color: "#000", fontSize: 14, textAlign: 'left', fontWeight: '600' }}>Select Date Range</Text>
                <View style={styles.splitContainer}>
                  <DatePick
                    label={{ visible: filter.FROM_DATE ? true : false, text: 'From Date' }}
                    value={filter.FROM_DATE}
                    setDate={e => setFilter({ ...filter, FROM_DATE: e })}
                    options={{ width: '46.2%' }}
                  />
                  <DatePick
                    label={{ visible: filter.TO_DATE ? true : false, text: 'To Date' }}
                    value={filter.TO_DATE}
                    setDate={e => setFilter({ ...filter, TO_DATE: e })}
                    options={{ width: '46.2%' }}
                  />
                </View>
              </View>
              <MultiSelectComponent
                label={{ visible: filter.ANIMAL_TYPE ? true : false, text: 'Animal Type' }}
                value={filter.ANIMAL_TYPE || []}
                onChangeText={e => setFilter({ ...filter, ANIMAL_TYPE: e })}
                options={{}}
                data={dropdownData.type}
              /><MultiSelectComponent
                label={{ visible: filter.ANIMAL_BREED ? true : false, text: 'Animal Breed' }}
                value={filter.ANIMAL_BREED || []}
                onChangeText={e => setFilter({ ...filter, ANIMAL_BREED: e })}
                options={{}}
                data={dropdownData.breed}
              /><MultiSelectComponent
                label={{ visible: filter.DISTRICT ? true : false, text: 'District' }}
                value={filter.DISTRICT || []}
                onChangeText={e => setFilter({ ...filter, DISTRICT: e })}
                options={{}}
                data={dropdownData.district}
              />
              <MultiSelectComponent
                label={{ visible: filter.TALUKA ? true : false, text: 'Taluka' }}
                value={filter.TALUKA || []}
                onChangeText={e => setFilter({ ...filter, TALUKA: e })}
                options={{}}
                data={dropdownData.taluka}
              />
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, borderTopWidth: 0.5 }}>
              <TouchableOpacity
                onPress={() => clearAll()}>
                <View style={styles.buttonContainer}>
                  <Text style={[styles.button, { backgroundColor: '#fff', color: "#4B1AFF", borderColor: '#4B1AFF', borderWidth: 1 }]} >Clear All</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => apply()}>
                <View style={styles.buttonContainer}>
                  <Text style={styles.button} >Apply</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 5,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 40,
    fontSize: 16,
    width: 130,
    backgroundColor: '#4B1AFF',
    color: '#fff',
    borderRadius: 10,
    textAlign: 'center',
    paddingTop: 9,
    fontFamily: 'Poppins-Medium',
  },
  splitContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 22,
    flexDirection: 'row',
  },
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

export default AiReport;
