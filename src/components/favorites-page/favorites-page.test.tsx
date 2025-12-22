import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import FavoritesPage from './favorites-page';
import { offers } from '../../mocks/offers';

vi.mock('../place-card/place-card', () => ({
  default: ({ offer }: { offer: (typeof offers)[number] }) => (
    <div>Favorite offer: {offer.title}</div>
  ),
}));

describe('Компонент: FavoritesPage', () => {
  it('должен показывать пустой список избранного, когда нет предложений', () => {
    render(<FavoritesPage offers={[]} />);

    expect(screen.getByText('Saved listing')).toBeInTheDocument();
    // Количество избранного в хедере должно быть 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('должен показывать избранное, сгруппированное по городам, и корректное количество избранного', () => {
    render(<FavoritesPage offers={offers} />);

    // Заголовок страницы избранного
    expect(screen.getByText('Saved listing')).toBeInTheDocument();

    // В хедере должно отображаться количество всех избранных предложений
    const favoritesCount = offers.length;
    expect(screen.getByText(String(favoritesCount))).toBeInTheDocument();

    // На странице должны отображаться названия городов из переданных офферов
    const cityNames = Array.from(new Set(offers.map((offer) => offer.city.name)));
    cityNames.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });
  });
});
