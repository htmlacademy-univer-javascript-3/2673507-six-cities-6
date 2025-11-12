import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { reviews } from './mocks/reviews';
import { Provider } from 'react-redux';
import { store } from './store';
import { loadOffers } from './store/action';
import { offers } from './mocks/offers';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

store.dispatch(loadOffers(offers));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App reviews={reviews} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
