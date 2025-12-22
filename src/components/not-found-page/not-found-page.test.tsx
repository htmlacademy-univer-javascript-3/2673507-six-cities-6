import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import NotFoundPage from './not-found-page';

describe('Компонент: NotFoundPage', () => {
  it('должен отрисовывать страницу 404', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    expect(screen.getByText(/go to main page/i)).toBeInTheDocument();
  });
});
