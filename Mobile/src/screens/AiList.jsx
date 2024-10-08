import React, { useEffect, useState } from 'react';
import { ToastAndroid, FlatList, StyleSheet, TouchableOpacity, View, TextInput, Modal, Text, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setStatusBar } from '../reduxStore/userSlice';
import Header from '../components/Header';
import VectorIcon from '../utils/VectorIcon';
import { apiPost } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import AIItem from '../components/AIItem';
import Loader from '../components/Loader';

const AiList = () => {
  const user = useSelector(state => state.user.userInfo);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
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
      const res = await apiPost("api/aiDetails/get", {
        pageIndex: search.pageIndex,
        sortKey: "ID",
        sortValue: "ASC",
        pageSize: 50,
        filter: ` AND IS_CLOSED = 0 AND MEMBER_ID = ${user.ID} AND (ANIMAL_IDENTITY_NO LIKE '%${search.value}%' OR CASE_NO LIKE '%${search.value}%' OR OWNER_NAME LIKE '%${search.value}%' OR MOBILE_NUMBER LIKE '%${search.value}%')`
      });
      if (res && res.code === 200) {
        let updatedData = []
        if (ind === 1) {
          updatedData = res.data;
        } else {
          updatedData = [...dataSearch, ...res.data];
        }
        setDataSearch(updatedData);
        setSearch({ ...search, pageIndex: search.pageIndex + 1, isOn: true });
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
      const res = await apiPost("api/aiDetails/get", {
        pageIndex: pageIndex,
        sortKey: "ID",
        sortValue: "DESC",
        pageSize: 50,
        filter: " AND IS_CLOSED = 0 AND MEMBER_ID = " + user.ID
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
    });
    return unsubscribe;
  }, [navigation]);

  const handlePress = () => {
    if (user.PLAN_DETAILS.PLAN_ID != null && (user.PLAN_DETAILS.END_DATE == null || new Date(user.PLAN_DETAILS.END_DATE) > new Date())) {
      navigation.navigate('AIFormModal', { item: {} });
    }
    else {
      setModalVisible(true);
    }
  };

  const handleSubscription = () => {
    setModalVisible(false);
    dispatch(setStatusBar({ backgroundColor: "#E6F4FE", barStyle: "dark-content" }))
    navigation.navigate('Subscription');
  };

  return (
    <>
      <Header name="Artificial Insemination" />
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
            onSubmitEditing={() => getDataSearch()}
          />
        </View>
        {(search.isOn && dataSearch.length > 0) || (!search.isOn && data.length > 0) ?
          <FlatList
            data={search.isOn ? dataSearch : data}
            initialNumToRender={6}
            renderItem={({ item }) => (
              <AIItem item={item} />
            )}
            keyExtractor={item => item.ID}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
            onEndReached={search.isOn ? getDataSearch : getData}
            onEndReachedThreshold={0.1}
          /> :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/empty.png')} style={{ width: 150, height: 150, opacity: 0.5 }} />
          </View>
        }
        <TouchableOpacity onPress={() => handlePress()} style={styles.addButton}>
          <VectorIcon type="Feather" name="plus" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Text onPress={() => setModalVisible(false)} style={{ backgroundColor: 'rgba(0,0,0,.7)', zIndex: -1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, width: '94%' }}>
            <View style={{ margin: 15, alignItems: 'center' }}>
              <View style={{ marginBottom: 15, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                <VectorIcon
                  name="closecircleo"
                  type="AntDesign"
                  size={28}
                  color="red"
                  onPress={() => setModalVisible(false)}
                  style={{ alignSelf: 'flex-end' }}
                />
              </View>
              <Text style={{ fontWeight: 'bold', fontSize: 24, fontFamily: "Poppins-Regular", color: '#000', textAlign: 'center', marginBottom: 10 }}>No Active Plan</Text>
              <Text style={{ textAlign: 'center', color: "#000", fontSize: 15, fontWeight: '500' }}>You currently do not have any active plan. Please purchase a plan to continue using our services.</Text>
              <TouchableOpacity
                style={{ height: 45, backgroundColor: "#4B1AFF", borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#4B1AFF", width: "80%", marginTop: 30 }}
                onPress={handleSubscription}
              >
                <Text style={{ fontSize: 16, color: "#fff", fontFamily: "Poppins-Medium", }}>Buy a Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >
      <Loader isLoading={isLoading} />
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
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#5d30ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AiList;
