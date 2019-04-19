import { Notifications } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { Icon } from 'react-native-elements';
import { PersistGate } from 'redux-persist/integration/react';

import registerForNotifications from './services/push_notifications';
import configureStore from './store';
import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import ReviewScreen from './screens/ReviewScreen';
import SettingsScreen from './screens/SettingsScreen';

export default class App extends React.Component {
  componentDidMount(){
    registerForNotifications();
    Notifications.addListener((notification) => {
        const { data: { message }, origin} = notification;
        
        if (origin === 'received' && message) {
          Alert.alert(
            'New Push Notification',
            message,
            [{ text: 'Ok.'}]
          );
        }
    });
  }
  
  render() {
    const MainNavigator = createBottomTabNavigator({
      welcome: { 
        screen: WelcomeScreen,
        navigationOptions: { tabBarVisible: false }
      },
      auth: { 
        screen: AuthScreen,
        navigationOptions: { tabBarVisible: false }
      },
      main: {
        screen: createBottomTabNavigator({
          map: { screen: MapScreen },
          deck: { screen: DeckScreen },
          review: {
            screen: createStackNavigator({
              review: { screen: ReviewScreen },
              settings: { screen: SettingsScreen }
            }),
            navigationOptions: {
              tabBarLabel: 'Review Jobs',
              tabBarIcon: ({ tintColor }) => {
                return <Icon name='favorite' size={30} color={tintColor} />
              },
            }
          }
        }, {
          tabBarOptions: {
            labelStyle: { fontSize: 12 }
          }
        }),
        navigationOptions: { tabBarVisible: false }
      }
    });

    const AppContainer = createAppContainer(MainNavigator);
    const { store, persistor } = configureStore();
    
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
