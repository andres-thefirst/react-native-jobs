import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

export default async () => {
  let previousToken = await AsyncStorage.getItem('pushtoken');
  console.log(previousToken);
  if (previousToken) {
    await axios.post(PUSH_ENDPOINT, {
        "to": previousToken,
        "title": "Notification",
        "body": "Please use our app again.",
        "data": { "message": "Notification - Please use our app again." }
    });
    return;
   } else {
    let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    await axios.post(PUSH_ENDPOINT, {
        "to": token,
        "title": "Notification",
        "body": "Please use our app again.",
        "data": { "message": "Notification - Please use our app again." }
    });
    console.log('token', token);
    AsyncStorage.setItem('pushtoken', token);
  }
};
