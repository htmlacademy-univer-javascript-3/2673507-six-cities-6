import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offer } from '../../types/offer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { toggleFavoriteStatusAction } from '../../store/api-actions';
import { selectAuthorizationStatus } from '../../store/selectors';

type PlaceCardProps = {
  offer: Offer;
  onCardHover?: (offerId: string | null) => void;
  cardClassName?: string;
  imageWrapperClassName?: string;
};

function PlaceCard({
  offer,
  onCardHover,
  cardClassName = 'cities__card',
  imageWrapperClassName = 'cities__image-wrapper',
}: PlaceCardProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    onCardHover?.(offer.id);
  };

  const handleMouseLeave = () => {
    onCardHover?.(null);
  };

  const handleBookmarkClick = () => {
    if (authorizationStatus !== 'Auth') {
      navigate('/login');
      return;
    }

    const status = offer.isFavorite ? 0 : 1;
    dispatch(toggleFavoriteStatusAction({ offerId: offer.id, status }));
  };

  const roundedRating = Math.round(offer.rating);

  return (
    <article
      className={`${cardClassName} place-card`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={`${imageWrapperClassName} place-card__image-wrapper`}>
        <Link to={`/offer/${offer.id}`}>
          <img
            className="place-card__image"
            src={offer.previewImage}
            width="260"
            height="200"
            alt="Place image"
          />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button ${
              offer.isFavorite ? 'place-card__bookmark-button--active' : ''
            } button`}
            type="button"
            onClick={handleBookmarkClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use href="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${(roundedRating / 5) * 100}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
}

const MemoizedPlaceCard = memo(PlaceCard);

export default MemoizedPlaceCard;
