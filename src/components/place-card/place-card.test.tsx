import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import PlaceCard from './place-card';
import { offers } from '../../mocks/offers';
import type { AuthorizationStatus } from '../../store/action';

let mockDispatch: ReturnType<typeof vi.fn>;
let mockNavigate: ReturnType<typeof vi.fn>;
let mockAuthorizationStatus: AuthorizationStatus;

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: { authorizationStatus: AuthorizationStatus }) => AuthorizationStatus) =>
    selector({ authorizationStatus: mockAuthorizationStatus }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: 'a',
}));

vi.mock('../../store/api-actions', () => ({
  toggleFavoriteStatusAction: vi.fn((payload: { offerId: string; status: 0 | 1 }) => ({
    type: 'favorites/toggleFavoriteStatus',
    payload,
  })),
}));

import { toggleFavoriteStatusAction } from '../../store/api-actions';

describe('Компонент: PlaceCard', () => {
  beforeEach(() => {
    mockDispatch = vi.fn();
    mockNavigate = vi.fn();
    mockAuthorizationStatus = 'NoAuth';
    vi.clearAllMocks();
  });

  it('должен вызывать onCardHover при наведении и уходе курсора', () => {
    const offer = offers[0];
    const handleCardHover = vi.fn();

    render(<PlaceCard offer={offer} onCardHover={handleCardHover} />);

    const card = screen.getByText(offer.title).closest('article');

    if (!card) {
      throw new Error('Карточка предложения не найдена');
    }

    fireEvent.mouseEnter(card);
    expect(handleCardHover).toHaveBeenCalledWith(offer.id);

    fireEvent.mouseLeave(card);
    expect(handleCardHover).toHaveBeenCalledWith(null);
  });

  it('должен перенаправлять на страницу логина при клике по избранному и неавторизованном пользователе', () => {
    const offer = offers[0];
    mockAuthorizationStatus = 'NoAuth';

    render(<PlaceCard offer={offer} />);

    const bookmarkButton = screen.getByRole('button', { name: /to bookmarks/i });

    fireEvent.click(bookmarkButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('должен диспатчить toggleFavoriteStatusAction при клике по избранному и авторизованном пользователе', () => {
    const offer = offers[0];
    mockAuthorizationStatus = 'Auth';

    render(<PlaceCard offer={offer} />);

    const bookmarkButton = screen.getByRole('button', { name: /to bookmarks/i });

    fireEvent.click(bookmarkButton);

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(toggleFavoriteStatusAction).toHaveBeenCalledWith({
      offerId: offer.id,
      status: 1,
    });
  });
});
