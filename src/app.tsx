import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/main-page/main-page';
import LoginPage from './components/login-page/login-page';
import FavoritesPage from './components/favorites-page/favorites-page';
import OfferPage from './components/offer-page/offer-page';
import NotFoundPage from './components/not-found-page/not-found-page';
import PrivateRoute from './components/private-route/private-route';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthorizationStatus, selectFavorites } from './store/selectors';
import { fetchFavoritesAction } from './store/api-actions';
import { AppDispatch } from './store';

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const favoriteOffers = useSelector(selectFavorites);

  useEffect(() => {
    if (authorizationStatus === 'Auth') {
      dispatch(fetchFavoritesAction());
    }
  }, [authorizationStatus, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <FavoritesPage offers={favoriteOffers} />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<OfferPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
