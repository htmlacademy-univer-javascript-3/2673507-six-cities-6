import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PlaceCard from '../place-card/place-card';
import { Offer } from '../../types/offer';
import { AppDispatch } from '../../store';
import { logoutAction } from '../../store/api-actions';
import { selectAuthorizationStatus, selectUserEmail } from '../../store/selectors';

type FavoritesPageProps = {
  offers: Offer[];
};

function FavoritesPage({ offers }: FavoritesPageProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const userEmail = useSelector(selectUserEmail);

  const favoritesCount = offers.length;
  const hasFavorites = favoritesCount > 0;

  const offersByCity = useMemo(
    () =>
      offers.reduce((acc, offer) => {
        const cityName = offer.city.name;
        if (!acc[cityName]) {
          acc[cityName] = [];
        }
        acc[cityName].push(offer);
        return acc;
      }, {} as Record<string, Offer[]>),
    [offers]
  );

  const isAuth = authorizationStatus === 'Auth';

  return (
    <div className={`page ${hasFavorites ? '' : 'page--favorites-empty'}`}>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {isAuth ? (
                  <>
                    <li className="header__nav-item user">
                      <Link
                        className="header__nav-link header__nav-link--profile"
                        to="/favorites"
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                        <span className="header__user-name user__name">
                          {userEmail}
                        </span>
                        <span className="header__favorite-count">
                          {favoritesCount}
                        </span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <button
                        className="header__nav-link"
                        style={{ background: 'none', border: 'none' }}
                        onClick={() => void dispatch(logoutAction())}
                      >
                        <span className="header__signout">Sign out</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to="/login"
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main
        className={`page__main page__main--favorites ${hasFavorites ? '' : 'page__main--favorites-empty'}`}
      >
        <div className="page__favorites-container container">
          {hasFavorites ? (
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {Object.entries(offersByCity).map(([cityName, cityOffers]) => (
                  <li key={cityName} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link" href="#">
                          <span>{cityName}</span>
                        </a>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {cityOffers.map((offer) => (
                        <PlaceCard
                          key={offer.id}
                          offer={offer}
                          cardClassName="favorites__card"
                          imageWrapperClassName="favorites__image-wrapper"
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">
                  Save properties to narrow down search or plan your future trips.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
      <footer className="footer container">
        <a className="footer__logo-link" href="/">
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </a>
      </footer>
    </div>
  );
}

export default FavoritesPage;
