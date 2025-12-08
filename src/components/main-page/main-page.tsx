import PlacesList from '../places-list/places-list';
import Map from '../map/map';
import CitiesList from '../cities-list/cities-list';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import Spinner from '../spinner/spinner';
import { useMemo, useState } from 'react';
import SortOptions, { SortType } from '../sort-options/sort-options';
import { Link } from 'react-router-dom';
import { logoutAction } from '../../store/api-actions';
import {
  selectAuthorizationStatus,
  selectCity,
  selectFavoriteCount,
  selectOffersByCity,
  selectUserEmail,
  selectIsOffersLoading,
} from '../../store/selectors';

function MainPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const city = useSelector(selectCity);
  const offers = useSelector(selectOffersByCity);
  const isOffersLoading = useSelector(selectIsOffersLoading);
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const userEmail = useSelector(selectUserEmail);
  const favoriteCount = useSelector(selectFavoriteCount);
  const [sort, setSort] = useState<SortType>('Popular');
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const sortedOffers = useMemo(() => {
    const arr = offers.slice();
    switch (sort) {
      case 'Price: low to high':
        return arr.sort((a, b) => a.price - b.price);
      case 'Price: high to low':
        return arr.sort((a, b) => b.price - a.price);
      case 'Top rated first':
        return arr.sort((a, b) => b.rating - a.rating);
      case 'Popular':
      default:
        return offers;
    }
  }, [offers, sort]);

  if (isOffersLoading) {
    return <Spinner />;
  }

  const isAuth = authorizationStatus === 'Auth';

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a
                className="header__logo-link header__logo-link--active"
                href="/"
              >
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </a>
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
                          {favoriteCount}
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

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <CitiesList />
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {sortedOffers.length} places to stay in {city}
              </b>
              <SortOptions value={sort} onChange={setSort} />
              <PlacesList
                offers={sortedOffers}
                onActiveChange={setActiveOfferId}
              />
            </section>
            <div className="cities__right-section">
              <section className="cities__map map">
                <Map offers={sortedOffers} activeOfferId={activeOfferId} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
