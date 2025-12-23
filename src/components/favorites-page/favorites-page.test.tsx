import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

import FavoritesPage from './favorites-page';
import { offers } from '../../mocks/offers';
import { reducer } from '../../store/reducer';
import type { OffersState } from '../../store/reducer';

vi.mock('../place-card/place-card', () => ({
  default: ({ offer }: { offer: (typeof offers)[number] }) => (
    <div>Favorite offer: {offer.title}</div>
  ),
}));

const makeState = (initial?: Partial<OffersState>): OffersState => {
  const baseState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
  return { ...baseState, authorizationStatus: 'Auth', userEmail: 'user@test.com', ...initial };
};

const renderWithStore = (offersForPage: OffersState['favorites']) => {
  const store = configureStore({
    reducer,
    preloadedState: makeState({ favorites: offersForPage }),
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <FavoritesPage offers={offersForPage} />
      </MemoryRouter>
    </Provider>
  );
};

describe('Компонент: FavoritesPage', () => {
  it('должен показывать пустой список избранного, когда нет предложений', () => {
    renderWithStore([]);

    // Должно отображаться пустое состояние избранного
    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    // Количество избранного в хедере должно быть 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('должен показывать избранное, сгруппированное по городам, и корректное количество избранного', () => {
    renderWithStore(offers);

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
