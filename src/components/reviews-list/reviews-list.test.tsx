import { render, screen } from '@testing-library/react';

import ReviewsList from './reviews-list';
import { reviews } from '../../mocks/reviews';

describe('Компонент: ReviewsList', () => {
  it('должен отображать количество отзывов и список отзывов', () => {
    render(<ReviewsList reviews={reviews} />);

    expect(screen.getByText(String(reviews.length))).toBeInTheDocument();

    reviews.forEach((review) => {
      expect(screen.getByText(review.comment)).toBeInTheDocument();
    });
  });
});
