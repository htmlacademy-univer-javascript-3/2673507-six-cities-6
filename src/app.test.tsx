import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';

import App from './app';
import { reducer } from './store/reducer';
import type { OffersState } from './store/reducer';

vi.mock('./components/main-page/main-page', () => ({
  default: () => <div>Main page</div>,
}));

vi.mock('./components/login-page/login-page', () => ({
  default: () => <div>Login page</div>,
}));

vi.mock('./components/favorites-page/favorites-page', () => ({
  default: () => <div>Favorites page</div>,
}));

vi.mock('./components/offer-page/offer-page', () => ({
  default: () => <div>Offer page</div>,
}));

vi.mock('./components/not-found-page/not-found-page', () => ({
  default: () => <div>Not found page</div>,
}));

const makeState = (initial?: Partial<OffersState>): OffersState => {
  const baseState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
  return { ...baseState, ...initial };
};

const renderApp = (initialEntries: string[], state?: Partial<OffersState>) => {
  const store = configureStore({
    reducer,
    preloadedState: makeState(state),
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe('Маршрутизация приложения', () => {
  it('должен показывать главную страницу при переходе на "/"', () => {
    renderApp(['/']);

    expect(screen.getByText('Main page')).toBeInTheDocument();
  });

  it('должен показывать страницу логина при переходе на "/login"', () => {
    renderApp(['/login']);

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('должен показывать страницу предложения при переходе на "/offer/:id"', () => {
    renderApp(['/offer/1']);

    expect(screen.getByText('Offer page')).toBeInTheDocument();
  });

  it('должен перенаправлять на логин со страницы избранного, если пользователь не авторизован', () => {
    renderApp(['/favorites'], { authorizationStatus: 'NoAuth' });

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('должен показывать страницу 404 при переходе на неизвестный маршрут', () => {
    renderApp(['/unknown-route']);

    expect(screen.getByText('Not found page')).toBeInTheDocument();
  });
});
