import { applyMiddleware, createStore, Store } from 'redux';
import { persistStore, persistReducer, Persistor } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import reducers from './reducers';

const persistConfig = {
	key: 'rich-penny',
	storage,
	whitelist: ['richPenny'], // which reducer want to store
	version: 0,
};

const pReducer = persistReducer(persistConfig, reducers);

export const store: Store = createStore(pReducer, applyMiddleware(thunk));

export const persistor: Persistor = persistStore(store);
