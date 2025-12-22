import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import PlacesList from './places-list';
import { offers } from '../../mocks/offers';

vi.mock('../place-card/place-card', () => ({
  default: ({ offer, onCardHover }: { offer: (typeof offers)[number]; onCardHover?: (id: string | null) => void }) => (
    <div
      data-testid={`place-card-${offer.id}`}
      onMouseEnter={() => onCardHover?.(offer.id)}
    >
      PlaceCard: {offer.title}
    </div>
  ),
}));

describe('Компонент: PlacesList', () => {
  it('должен рендерить карточку для каждого предложения', () => {
    const testOffers = offers.slice(0, 3);

    render(<PlacesList offers={testOffers} />);

    const cards = screen.getAllByText(/PlaceCard:/i);
    expect(cards).toHaveLength(testOffers.length);
  });

  it('должен вызывать onActiveChange при наведении на карточку', () => {
    const testOffers = offers.slice(0, 2);
    const handleActiveChange = vi.fn();

    render(
      <PlacesList
        offers={testOffers}
        onActiveChange={handleActiveChange}
      />
    );

    const firstCard = screen.getByTestId(`place-card-${testOffers[0].id}`);

    fireEvent.mouseEnter(firstCard);

    expect(handleActiveChange).toHaveBeenCalledWith(testOffers[0].id);
  });
});
