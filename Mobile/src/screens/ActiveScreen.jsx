import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { apiPost } from '../utils/api';
import Loader from '../components/Loader';

const ActiveScreen = () => {

  const user = useSelector(state => state.user.userInfo);
  const [memberCounts, setMemberCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const Rediect = (screen) => {
    navigation.navigate(screen);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const resMemberCounts = await apiPost("api/summary/getTypeWiseCount", {
        filter: " AND MEMBER_ID = " + user.ID + " GROUP BY CASE_TYPE"
      });
      setMemberCounts(resMemberCounts.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  let counts = {
    TYPE1: memberCounts?.filter(item => item.CASE_TYPE === 1)[0],
    TYPE2: memberCounts?.filter(item => item.CASE_TYPE === 2)[0],
    TYPE3: memberCounts?.filter(item => item.CASE_TYPE === 3)[0]
  }

  return (
    <>
      <Header name="Active" />
      <View style={styles.container}>
        {/* <View style={{ flexDirection: 'row', padding: 10, gap: 10 }}>
          <TouchableOpacity style={[styles.tab, { backgroundColor: active.insumate }]} onPress={() => setActive({ insumate: '#4B1AFF', pet: '#fff' })}>
            <Text style={[styles.title, { color: active.pet }]}>Artificial Insemination</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, { backgroundColor: active.pet }]} onPress={() => setActive({ insumate: '#fff', pet: '#4B1AFF' })}>
            <Image
              source={require('../assets/pets.png')}
              style={{ width: 40, height: 40 }}
            />
            <Text style={[styles.title, { color: active.insumate }]}>Active</Text>
          </TouchableOpacity>
        </View> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.container, { paddingVertical: 20, }]}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Rediect('PatientCaseList')}>
              <LinearGradient
                colors={['#EfefFf', '#7c97ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.7, y: 1 }}
                style={styles.cardContainer}
              >
                <Image
                  source={require('../assets/clinic.png')}
                  style={{ width: 90, height: 90, resizeMode: 'contain' }}
                />
                <View style={styles.innerContainer}>
                  <View style={styles.stat}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#3c65fc' }}>{counts.TYPE1?.CLOSED?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}>Closed</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#3c65fc' }}>{counts.TYPE1?.ACTIVE?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}>Open</Text>
                    </View>
                  </View>
                  <Text style={styles.title}>Patient Case</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Rediect('AiList')}>
              <LinearGradient
                colors={['#EfefFf', '#7c97ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.7, y: 1 }}
                style={styles.cardContainer}
              >
                <Image
                  source={require('../assets/insemination.png')}
                  style={{ width: 90, height: 90, resizeMode: 'contain' }}
                />
                <View style={styles.innerContainer}>
                  <View style={styles.stat}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#3c65fc' }}>{counts.TYPE2?.CLOSED?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}>Closed</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#3c65fc' }}>{counts.TYPE2?.ACTIVE?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}>Open</Text>
                    </View>
                  </View>
                  <Text style={styles.title}>Artificial Insemination</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Rediect('VaccinationList')}>
              <LinearGradient
                colors={['#EfefFf', '#7c97ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.7, y: 1 }}
                style={styles.cardContainer}
              >
                <Image
                  source={require('../assets/injection.png')}
                  style={{ width: 90, height: 90, resizeMode: 'contain' }}
                />
                <View style={styles.innerContainer}>
                  <View style={styles.stat}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#3c65fc' }}>{counts.TYPE3?.CLOSED?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}>Closed</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#3c65fc' }}>{counts.TYPE3?.ACTIVE?.toString().padStart(3, '0')}</Text>
                      <Text style={styles.statsText}>Open</Text>
                    </View>
                  </View>
                  <Text style={styles.title}>Vaccination</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Loader isLoading={isLoading} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  statsText: {
    fontSize: 13,
    color: '#160163',
    fontWeight: 'bold',
    marginTop: 2,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 80,
    width: '80%',
    borderRadius: 10,
    padding: 10,
    paddingTop: 20,
    marginTop: 10,
    backgroundColor: '#ecf0ff',
  },
  innerContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    // backgroundColor:'red',
    flexDirection: 'column',
    width: '50%',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    width: 320,
    height: 210,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#4B1AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    // width: '50%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#160163',
  },
  tab: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    height: 60,
    flex: 1,
    width: '50%',
    borderWidth: 1,
    borderColor: '#4B1AFF',
    color: "#5a5a5a",
    borderRadius: 20,
  },
  container: {
    flex: 1,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ActiveScreen;
