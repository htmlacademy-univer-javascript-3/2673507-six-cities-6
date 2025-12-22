import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';

import PrivateRoute from './private-route';
import { reducer } from '../../store/reducer';
import type { OffersState } from '../../store/reducer';

const makeState = (initial?: Partial<OffersState>): OffersState => {
  const baseState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
  return { ...baseState, ...initial };
};

const renderWithStoreAndRouter = (state: OffersState) => {
  const store = configureStore({
    reducer,
    preloadedState: state,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <span>Private content</span>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<span>Login page</span>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('Компонент: PrivateRoute', () => {
  it('должен отрисовывать дочерний контент для авторизованного пользователя', () => {
    const state = makeState({ authorizationStatus: 'Auth' });

    renderWithStoreAndRouter(state);

    expect(screen.getByText('Private content')).toBeInTheDocument();
  });

  it('должен перенаправлять на страницу логина, когда пользователь не авторизован', () => {
    const state = makeState({ authorizationStatus: 'NoAuth' });

    renderWithStoreAndRouter(state);

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('должен перенаправлять на страницу логина, когда статус авторизации Unknown', () => {
    const state = makeState({ authorizationStatus: 'Unknown' });

    renderWithStoreAndRouter(state);

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
