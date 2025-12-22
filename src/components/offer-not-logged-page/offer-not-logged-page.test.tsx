import { render, screen } from '@testing-library/react';

import OfferNotLoggedPage from './offer-not-logged-page';

describe('Компонент: OfferNotLoggedPage', () => {
  it('должен отображать страницу предложения для неавторизованного пользователя', () => {
    render(<OfferNotLoggedPage />);

    expect(
      screen.getByText('Beautiful & luxurious studio at great location')
    ).toBeInTheDocument();

    expect(screen.getAllByText('Sign in')[0]).toBeInTheDocument();

    expect(
      screen.getByText('Other places in the neighbourhood')
    ).toBeInTheDocument();
  });
});
