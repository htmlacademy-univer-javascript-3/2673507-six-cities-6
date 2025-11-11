import { Routes, Route } from 'react-router-dom';
import MainPage from './components/main-page/main-page';
import LoginPage from './components/login-page/login-page';
import FavoritesPage from './components/favorites-page/favorites-page';
import OfferPage from './components/offer-page/offer-page';
import NotFoundPage from './components/not-found-page/not-found-page';
import PrivateRoute from './components/private-route/private-route';
import { Offer } from './types/offer';

type AppProps = {
  offers: Offer[];
};

function App({ offers }: AppProps): JSX.Element {
  const isAuthorized = false;

  return (
    <Routes>
      <Route path="/" element={<MainPage offers={offers} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute isAuthorized={isAuthorized}>
            <FavoritesPage
              offers={offers.filter((offer) => offer.isFavorite)}
            />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<OfferPage offers={offers} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
