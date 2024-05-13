import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View ,ActivityIndicator} from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import VectorIcon from '../utils/VectorIcon';
// import AIFormModal from '../components/AIFormModal';
import { apiPost } from '../utils/api';
import { useNavigation } from '@react-navigation/native';

const AiList = () => {
  const user = useSelector(state => state.user.userInfo);
  // const [showForm, setShowForm] = useState({ isVisible: false, data: {} });
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    try {
      if (pageIndex == 1) {
        setIsLoading(true);
      }
      const res = await apiPost("api/aiDetails/get", {
        pageIndex: pageIndex,
        sortKey: "ID",
        sortValue: "ASC",
        pageSize: 50,
        filter: " AND MEMBER_ID = " + user.ID
      });
      let updatedData = [...data, ...res.data];
      setData(updatedData);
      setPageIndex(pageIndex + 1);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  // const openForm = (item) => {
  //   setShowForm({ isVisible: true, data: item });
  // };

  const renderItem = ({ item }) => (
    // <TouchableOpacity onPress={() => openForm(item)}>
    <TouchableOpacity onPress={() => navigation.navigate('AIFormModal', { item })}>
      <View style={styles.itemCard}>
        <Text style={{ color: '#4B1AFF' }}>{item.OWNER_NAME}</Text>
        <Text>{item.ANIMAL_IDENTITY_NO}</Text>
        <Text>{item.CASE_NO}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header name="Artificial Insemination" />
      <View style={{ flex: 1, padding: 20 }}>
        {isLoading ?
          <ActivityIndicator size="large" color="#4B1AFF" style={{ flex: 1 }} /> :
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.ID}
            contentContainerStyle={{ paddingBottom: 60 }}
            showsVerticalScrollIndicator={false}
            onEndReached={getData}
            onEndReachedThreshold={0.1}
          />
        }
        <TouchableOpacity onPress={() => navigation.navigate('AIFormModal', {})} style={styles.addButton}>
          <VectorIcon type="Feather" name="plus" size={40} color="#fff" />
        </TouchableOpacity>
        {/* <AIFormModal
          showModal={showForm.isVisible}
          setModal={() => setShowForm(prevState => ({ ...prevState, isVisible: false }))}
          data={showForm.data}
        /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0EC2DB',
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
