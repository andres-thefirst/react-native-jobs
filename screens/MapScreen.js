import React , { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MapView, Permissions } from 'expo';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

import * as actions from '../actions';

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Map',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name='my-location' size={30} color={tintColor} />
    }
  };

  state = {
    mapLoaded: false,
    region: {
      longitude: -122.4324,
      latitude: 37.78825,
      longitudeDelta: 0.0421,
      latitudeDelta: 0.0922,
    }
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.LOCATION);
    this.setState({ mapLoaded: true });
  }

  onRegionChangeComplete = (region) => {
    this.setState({ region });
  }

  onButtonPress = () => {
    this.props.fetchJobs(this.state.region, () => {
      this.props.navigation.navigate('deck');
    });
  }

  render() {
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View  style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}
        />
        <View styles={styles.buttonContainer}>
          <Button
            large
            title="Search This Area"
            buttonStyle={{backgroundColor:"#009688"}}
            icon={{ name: 'search' }}
            onPress={this.onButtonPress}
          ></Button>
        </View>
      </View>
    );
  }
}

const styles = {
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0
  }
}

export default connect(null, actions)(MapScreen);