import { Review } from '../types/review';

export const reviews: Review[] = [
  {
    id: 'r1',
    offerId: '1',
    user: { name: 'Max', avatarUrl: 'img/avatar-max.jpg', isPro: false },
    rating: 4,
    comment:
      'A quiet cozy and picturesque that hides behind a river by the unique lightness of Amsterdam.',
    date: '2019-04-24T14:13:56.569Z',
  },
  {
    id: 'r2',
    offerId: '1',
    user: { name: 'Angelina', avatarUrl: 'img/avatar-angelina.jpg', isPro: true },
    rating: 5,
    comment: 'Wonderful place with amazing view. Highly recommended!',
    date: '2020-01-12T10:20:30.000Z',
  },
  {
    id: 'r3',
    offerId: '2',
    user: { name: 'Oliver', avatarUrl: 'img/avatar-max.jpg', isPro: false },
    rating: 3,
    comment: 'Decent room for a short stay, close to public transport.',
    date: '2021-06-05T08:00:00.000Z',
  },
];
