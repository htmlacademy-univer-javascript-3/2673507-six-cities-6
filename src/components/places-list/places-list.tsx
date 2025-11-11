import { useState } from 'react';
import PlaceCard from '../place-card/place-card';
import { Offer } from '../../types/offer';

type PlacesListProps = {
  offers: Offer[];
  cardClassName?: string;
  imageWrapperClassName?: string;
};

function PlacesList({
  offers,
  cardClassName,
  imageWrapperClassName,
}: PlacesListProps): JSX.Element {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleCardHover = (offerId: string | null) => {
    setActiveCardId(offerId);
  };

  return (
    <div className="cities__places-list places__list tabs__content">
      {activeCardId}
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

export default PlacesList;
