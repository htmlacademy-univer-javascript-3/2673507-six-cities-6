import { render, screen } from '@testing-library/react';
import MainEmptyPage from './main-empty-page';

describe('Компонент: MainEmptyPage', () => {
  it('должен отрисовывать пустое состояние для переданного города', () => {
    const city = 'Paris';

    render(<MainEmptyPage city={city} />);

    expect(
      screen.getByText('No places to stay available')
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes(
          `We could not find any property available at the moment in ${city}`
        )
      )
    ).toBeInTheDocument();
  });
});
