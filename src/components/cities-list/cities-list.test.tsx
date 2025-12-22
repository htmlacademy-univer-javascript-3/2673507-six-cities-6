import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';

import CitiesList from './cities-list';
import { reducer } from '../../store/reducer';
import type { OffersState } from '../../store/reducer';

const makeState = (initial?: Partial<OffersState>): OffersState => {
  const baseState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
  return { ...baseState, ...initial };
};

const renderWithStore = (state?: Partial<OffersState>) => {
  const store = configureStore({
    reducer,
    preloadedState: makeState(state),
  });

  return render(
    <Provider store={store}>
      <CitiesList />
    </Provider>
  );
};

describe('Компонент: CitiesList', () => {
  it('должен отображать список городов и подсвечивать активный город из стора', () => {
    renderWithStore({ city: 'Amsterdam' });

    const amsterdamLink = screen.getByText('Amsterdam').closest('a');
    const parisLink = screen.getByText('Paris').closest('a');

    expect(amsterdamLink).toHaveClass('tabs__item--active');
    expect(parisLink).not.toHaveClass('tabs__item--active');
  });

  it('должен изменять активный город при клике по городу', () => {
    renderWithStore({ city: 'Paris' });

    const cologneLink = screen.getByText('Cologne').closest('a');
    const parisLink = screen.getByText('Paris').closest('a');

    expect(parisLink).toHaveClass('tabs__item--active');

    if (!cologneLink) {
      throw new Error('Ссылка на Cologne не найдена');
    }

    fireEvent.click(cologneLink);

    expect(cologneLink).toHaveClass('tabs__item--active');
  });
});
