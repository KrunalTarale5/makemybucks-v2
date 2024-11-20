import React from 'react';
import { createRoot } from 'react-dom/client';
import './_assets/root.css';
import '@utils/axiosInterceptors';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from '_store/store';
import { Provider } from 'react-redux';

const root = createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

root.render(
	<React.StrictMode>
		<Provider store={store}>
			{/* <PersistGate
				persistor={persistor}
				loading={null}
			> */}
			{/* 			{startTransition(() => ( */}
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</BrowserRouter>
			{/* 	))} */}
			{/* 	</PersistGate> */}
		</Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
