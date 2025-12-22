import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import ReviewForm from './review-form';
import { reducer } from '../../store/reducer';
import type { OffersState } from '../../store/reducer';

const makeState = (initial?: Partial<OffersState>): OffersState => {
  const baseState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
  return { ...baseState, ...initial };
};

const renderWithStore = (state?: Partial<OffersState>) => {
  const store = configureStore({
    reducer,
    preloadedState: makeState(state),
  });

  const result = render(
    <Provider store={store}>
      <ReviewForm offerId="1" />
    </Provider>
  );

  return { store, ...result };
};

describe('Компонент: ReviewForm', () => {
  it('должен отключать отправку, если рейтинг не выбран или комментарий слишком короткий', () => {
    renderWithStore();

    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).toBeDisabled();

    const commentField = screen.getByRole('textbox');

    fireEvent.change(commentField, { target: { value: 'Too short comment' } });

    expect(submitButton).toBeDisabled();
  });

  it('должен отправлять отзыв при валидных данных и очищать форму', () => {
    const { store } = renderWithStore();

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const ratingInput = screen.getByLabelText('perfect');
    const commentField = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    const longComment = 'a'.repeat(60);

    fireEvent.click(ratingInput);
    fireEvent.change(commentField, { target: { value: longComment } });

    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    expect(dispatchSpy).toHaveBeenCalled();
    expect(commentField).toHaveValue('');
    expect(submitButton).toBeDisabled();
  });

  it('не должен отправлять отзыв, когда идёт отправка (isReviewPosting = true)', () => {
    const { store } = renderWithStore({ isReviewPosting: true });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const ratingInput = screen.getByLabelText('perfect');
    const commentField = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    const longComment = 'a'.repeat(60);

    fireEvent.click(ratingInput);
    fireEvent.change(commentField, { target: { value: longComment } });

    // Кнопка должна быть заблокирована при isReviewPosting = true
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
