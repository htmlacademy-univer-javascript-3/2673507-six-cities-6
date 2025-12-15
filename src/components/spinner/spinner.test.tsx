import { render, screen } from '@testing-library/react';
import Spinner from './spinner';

describe('Компонент: Spinner', () => {
  it('должен отрисовывать текст загрузки', () => {
    render(<Spinner />);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });
});
