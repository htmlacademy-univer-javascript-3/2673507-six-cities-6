import { render, screen } from '@testing-library/react';

import ReviewItem from './review-item';
import { reviews } from '../../mocks/reviews';

describe('Компонент: ReviewItem', () => {
  it('должен корректно форматировать дату и отображать данные отзыва', () => {
    const review = reviews[0];

    render(<ReviewItem review={review} />);

    expect(screen.getByText(review.user.name)).toBeInTheDocument();
    expect(screen.getByText(review.comment)).toBeInTheDocument();

    const timeElement = screen.getByText('April 2019').closest('time');

    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute('dateTime', '2019-04-24');
  });
});
