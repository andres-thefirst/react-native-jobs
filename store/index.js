import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reducers from '../reducers';

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ['likedJobs']
};

const persistedReducer = persistCombineReducers(persistConfig, reducers);
export default (initialState={}) => {
  const store = createStore(
    persistedReducer,
    initialState,
    compose(
      applyMiddleware(thunk)
    )
  );
  const persistor = persistStore(store);
  return { store, persistor };
};
