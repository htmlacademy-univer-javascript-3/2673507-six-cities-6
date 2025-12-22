import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import SortOptions from './sort-options';

describe('Компонент: SortOptions', () => {
  it('должен отображать текущий вариант сортировки и открывать список по клику', () => {
    const handleChange = vi.fn();

    render(<SortOptions value="Popular" onChange={handleChange} />);

    const sortType = screen.getAllByText('Popular')[0];
    const optionsList = screen.getByRole('list');

    expect(optionsList.className).not.toContain('places__options--opened');

    fireEvent.click(sortType);

    expect(optionsList.className).toContain('places__options--opened');
  });

  it('должен вызывать onChange с выбранным вариантом и закрывать список', () => {
    const handleChange = vi.fn();

    render(<SortOptions value="Popular" onChange={handleChange} />);

    const sortType = screen.getAllByText('Popular')[0];
    fireEvent.click(sortType);

    const option = screen.getByText('Price: low to high');
    const optionsList = screen.getByRole('list');

    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith('Price: low to high');
    expect(optionsList.className).not.toContain('places__options--opened');
  });
});
