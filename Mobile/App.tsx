import React from 'react';
import type {PropsWithChildren} from 'react';
import {  StyleSheet,  Text,  useColorScheme,} from 'react-native';
import {  Colors} from 'react-native/Libraries/NewAppScreen';
import Router from './src/navigation/Router';
import { Provider } from 'react-redux'
import store from './src/reduxStore/store.js'

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store} >
      <Router/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  }
});

export default App;
