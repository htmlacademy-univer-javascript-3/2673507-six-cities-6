import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import NotFoundPage from './not-found-page';
import { reducer } from '../../store/reducer';

describe('Компонент: NotFoundPage', () => {
  it('должен отрисовывать страницу 404', () => {
    const store = configureStore({
      reducer,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    expect(screen.getByText(/go to main page/i)).toBeInTheDocument();
  });
});
