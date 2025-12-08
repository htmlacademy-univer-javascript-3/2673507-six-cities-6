import { memo, useCallback } from 'react';
import PlaceCard from '../place-card/place-card';
import { Offer } from '../../types/offer';

type PlacesListProps = {
  offers: Offer[];
  cardClassName?: string;
  imageWrapperClassName?: string;
  onActiveChange?: (offerId: string | null) => void;
};

function PlacesList({
  offers,
  cardClassName,
  imageWrapperClassName,
  onActiveChange,
}: PlacesListProps): JSX.Element {
  const handleCardHover = useCallback(
    (offerId: string | null) => {
      onActiveChange?.(offerId);
    },
    [onActiveChange]
  );

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <PlaceCard
          key={offer.id}
          offer={offer}
          onCardHover={handleCardHover}
          cardClassName={cardClassName}
          imageWrapperClassName={imageWrapperClassName}
        />
      ))}
    </div>
  );
}

const MemoizedPlacesList = memo(PlacesList);

export default MemoizedPlacesList;
