import { useEffect } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PlaceCard from '../place-card/place-card';
import ReviewForm from '../review-form/review-form';
import ReviewsList from '../reviews-list/reviews-list';
import Map from '../map/map';
import Spinner from '../spinner/spinner';
import { AppDispatch } from '../../store';
import {
  fetchOfferAction,
  fetchNearbyOffersAction,
  fetchCommentsAction,
  logoutAction,
  toggleFavoriteStatusAction,
} from '../../store/api-actions';
import {
  selectAuthorizationStatus,
  selectCurrentOffer,
  selectIsCurrentOfferLoading,
  selectIsCurrentOfferNotFound,
  selectNearbyOffers,
  selectReviews,
  selectUserEmail,
  selectFavoriteCount,
} from '../../store/selectors';

function OfferPage(): JSX.Element | null {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const offer = useSelector(selectCurrentOffer);
  const isCurrentOfferLoading = useSelector(selectIsCurrentOfferLoading);
  const isCurrentOfferNotFound = useSelector(selectIsCurrentOfferNotFound);
  const nearbyOffers = useSelector(selectNearbyOffers);
  const reviews = useSelector(selectReviews);
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const userEmail = useSelector(selectUserEmail);
  const favoriteCount = useSelector(selectFavoriteCount);

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(fetchOfferAction(id));
    dispatch(fetchNearbyOffersAction(id));
    dispatch(fetchCommentsAction(id));
  }, [dispatch, id]);

  if (isCurrentOfferLoading || !id) {
    return <Spinner />;
  }

  if (isCurrentOfferNotFound) {
    return <Navigate to="*" replace />;
  }

  if (!offer) {
    return null;
  }

  const nearPlaces = nearbyOffers;
  const isAuth = authorizationStatus === 'Auth';

  const handleBookmarkClick = () => {
    if (authorizationStatus !== 'Auth') {
      navigate('/login');
      return;
    }

    const status = offer.isFavorite ? 0 : 1;
    dispatch(toggleFavoriteStatusAction({ offerId: offer.id, status }));
  };

  const roundedRating = Math.round(offer.rating);

  const bedroomsText = offer.bedrooms === 1 ? '1 Bedroom' : `${offer.bedrooms} Bedrooms`;
  const adultsText = offer.maxAdults === 1 ? 'Max 1 adult' : `Max ${offer.maxAdults} adults`;

  const mapOffers = [offer, ...nearPlaces.slice(0, 3)].filter(
    (item, index, self) => self.findIndex((o) => o.id === item.id) === index
  );

  return (
    <div className="page">
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

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images.slice(0, 6).map((image) => (
                <div
                  key={`${offer.id}-${image}`}
                  className="offer__image-wrapper"
                >
                  <img
                    className="offer__image"
                    src={image}
                    alt="Photo studio"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer.title}</h1>
                <button
                  className={`offer__bookmark-button ${
                    offer.isFavorite ? 'offer__bookmark-button--active' : ''
                  } button`}
                  type="button"
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use href="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">
                    {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${(roundedRating / 5) * 100}%` }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {offer.rating}
                </span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {bedroomsText}
                </li>
                <li className="offer__feature offer__feature--adults">
                  {adultsText}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">€{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper ${
                      offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''
                    } user__avatar-wrapper`}
                  >
                    <img
                      className="offer__avatar user__avatar"
                      src={offer.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{offer.host.name}</span>
                  {offer.host.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              </div>
              <ReviewsList reviews={reviews} />
              {authorizationStatus === 'Auth' && (
                <ReviewForm offerId={offer.id} />
              )}
            </div>
          </div>
          <section className="offer__map map">
            <Map offers={mapOffers} activeOfferId={offer.id} />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <div className="near-places__list places__list">
              {nearPlaces.map((nearOffer) => (
                <PlaceCard
                  key={nearOffer.id}
                  offer={nearOffer}
                  cardClassName="near-places__card"
                  imageWrapperClassName="near-places__image-wrapper"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
