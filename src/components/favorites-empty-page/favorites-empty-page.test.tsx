import { render, screen } from '@testing-library/react';

import FavoritesEmptyPage from './favorites-empty-page';

describe('Компонент: FavoritesEmptyPage', () => {
  it('должен отображать пустое состояние избранного', () => {
    render(<FavoritesEmptyPage />);

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Save properties to narrow down search or plan your future trips.'
      )
    ).toBeInTheDocument();
  });
});
