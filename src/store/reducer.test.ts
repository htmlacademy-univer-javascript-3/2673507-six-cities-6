import { reducer } from './reducer';
import {
  changeCity,
  loadOffers,
  requireAuthorization,
  setUserEmail,
} from './action';
import {
  fetchOffersAction,
  fetchOfferAction,
  fetchNearbyOffersAction,
  fetchCommentsAction,
  postCommentAction,
  fetchFavoritesAction,
  toggleFavoriteStatusAction,
} from './api-actions';
import { offers } from '../mocks/offers';
import { reviews } from '../mocks/reviews';
import type { OffersState } from './reducer';

const makeInitialState = (): OffersState =>
  reducer(undefined, { type: 'UNKNOWN_ACTION' });

describe('Редьюсер: offers', () => {
  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const result = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result).toEqual(makeInitialState());
  });

  it('должен изменять город при экшене "changeCity"', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, changeCity('Amsterdam'));

    expect(result.city).toBe('Amsterdam');
  });

  it('должен загружать предложения при экшене "loadOffers"', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, loadOffers(offers));

    expect(result.offers).toEqual(offers);
  });

  it('должен менять authorizationStatus и очищать избранное при "requireAuthorization" с "NoAuth"', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      authorizationStatus: 'Auth',
      favorites: offers,
    };

    const result = reducer(initialState, requireAuthorization('NoAuth'));

    expect(result.authorizationStatus).toBe('NoAuth');
    expect(result.favorites).toEqual([]);
  });

  it('должен устанавливать userEmail при экшене "setUserEmail"', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, setUserEmail('test@test.ru'));

    expect(result.userEmail).toBe('test@test.ru');
  });

  it('должен устанавливать isOffersLoading в true при fetchOffersAction.pending', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, {
      type: fetchOffersAction.pending.type,
    });

    expect(result.isOffersLoading).toBe(true);
  });

  it('должен загружать предложения и избранное и сбрасывать isOffersLoading при fetchOffersAction.fulfilled', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, {
      type: fetchOffersAction.fulfilled.type,
      payload: offers,
    });

    expect(result.offers).toEqual(offers);
    expect(result.favorites).toEqual(offers.filter((offer) => offer.isFavorite));
    expect(result.isOffersLoading).toBe(false);
  });

  it('должен сбрасывать isOffersLoading при fetchOffersAction.rejected', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      isOffersLoading: true,
    };

    const result = reducer(initialState, {
      type: fetchOffersAction.rejected.type,
    });

    expect(result.isOffersLoading).toBe(false);
  });

  it('должен корректно выставлять флаги при fetchOfferAction.pending', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      currentOffer: offers[0],
      isCurrentOfferNotFound: true,
    };

    const result = reducer(initialState, {
      type: fetchOfferAction.pending.type,
    });

    expect(result.isCurrentOfferLoading).toBe(true);
    expect(result.isCurrentOfferNotFound).toBe(false);
    expect(result.currentOffer).toBeNull();
  });

  it('должен устанавливать currentOffer и сбрасывать флаги при fetchOfferAction.fulfilled', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, {
      type: fetchOfferAction.fulfilled.type,
      payload: offers[0],
    });

    expect(result.currentOffer).toEqual(offers[0]);
    expect(result.isCurrentOfferLoading).toBe(false);
    expect(result.isCurrentOfferNotFound).toBe(false);
  });

  it('должен устанавливать флаг not found при fetchOfferAction.rejected', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      isCurrentOfferLoading: true,
    };

    const result = reducer(initialState, {
      type: fetchOfferAction.rejected.type,
    });

    expect(result.currentOffer).toBeNull();
    expect(result.isCurrentOfferLoading).toBe(false);
    expect(result.isCurrentOfferNotFound).toBe(true);
  });

  it('должен устанавливать флаг загрузки и очищать nearbyOffers при fetchNearbyOffersAction.pending', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      nearbyOffers: offers,
    };

    const result = reducer(initialState, {
      type: fetchNearbyOffersAction.pending.type,
    });

    expect(result.areNearbyOffersLoading).toBe(true);
    expect(result.nearbyOffers).toEqual([]);
  });

  it('должен загружать nearbyOffers и сбрасывать флаг загрузки при fetchNearbyOffersAction.fulfilled', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, {
      type: fetchNearbyOffersAction.fulfilled.type,
      payload: offers,
    });

    expect(result.nearbyOffers).toEqual(offers);
    expect(result.areNearbyOffersLoading).toBe(false);
  });

  it('должен сбрасывать флаг загрузки и очищать nearbyOffers при fetchNearbyOffersAction.rejected', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      nearbyOffers: offers,
      areNearbyOffersLoading: true,
    };

    const result = reducer(initialState, {
      type: fetchNearbyOffersAction.rejected.type,
    });

    expect(result.areNearbyOffersLoading).toBe(false);
    expect(result.nearbyOffers).toEqual([]);
  });

  it('должен устанавливать areReviewsLoading в true при fetchCommentsAction.pending', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, {
      type: fetchCommentsAction.pending.type,
    });

    expect(result.areReviewsLoading).toBe(true);
  });

  it('должен загружать отзывы и сбрасывать areReviewsLoading при fetchCommentsAction.fulfilled', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, {
      type: fetchCommentsAction.fulfilled.type,
      payload: reviews,
    });

    expect(result.reviews).toEqual(reviews);
    expect(result.areReviewsLoading).toBe(false);
  });

  it('должен сбрасывать areReviewsLoading и очищать отзывы при fetchCommentsAction.rejected', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      reviews,
      areReviewsLoading: true,
    };

    const result = reducer(initialState, {
      type: fetchCommentsAction.rejected.type,
    });

    expect(result.areReviewsLoading).toBe(false);
    expect(result.reviews).toEqual([]);
  });

  it('должен устанавливать isReviewPosting в true при postCommentAction.pending', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, {
      type: postCommentAction.pending.type,
    });

    expect(result.isReviewPosting).toBe(true);
  });

  it('должен добавлять новый отзыв в начало и сбрасывать isReviewPosting при postCommentAction.fulfilled', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      reviews,
      isReviewPosting: true,
    };

    const newReview = {
      ...reviews[0],
      id: 'new',
    };

    const result = reducer(initialState, {
      type: postCommentAction.fulfilled.type,
      payload: newReview,
    });

    expect(result.isReviewPosting).toBe(false);
    expect(result.reviews[0]).toEqual(newReview);
    expect(result.reviews.slice(1)).toEqual(reviews);
  });

  it('должен сбрасывать isReviewPosting при postCommentAction.rejected', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      isReviewPosting: true,
    };

    const result = reducer(initialState, {
      type: postCommentAction.rejected.type,
    });

    expect(result.isReviewPosting).toBe(false);
  });

  it('должен устанавливать areFavoritesLoading в true при fetchFavoritesAction.pending', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, {
      type: fetchFavoritesAction.pending.type,
    });

    expect(result.areFavoritesLoading).toBe(true);
  });

  it('должен загружать избранное и сбрасывать areFavoritesLoading при fetchFavoritesAction.fulfilled', () => {
    const initialState = makeInitialState();

    const result = reducer(initialState, {
      type: fetchFavoritesAction.fulfilled.type,
      payload: offers,
    });

    expect(result.favorites).toEqual(offers);
    expect(result.areFavoritesLoading).toBe(false);
  });

  it('должен очищать избранное и сбрасывать areFavoritesLoading при fetchFavoritesAction.rejected', () => {
    const initialState: OffersState = {
      ...makeInitialState(),
      favorites: offers,
      areFavoritesLoading: true,
    };

    const result = reducer(initialState, {
      type: fetchFavoritesAction.rejected.type,
    });

    expect(result.favorites).toEqual([]);
    expect(result.areFavoritesLoading).toBe(false);
  });

  it('должен обновлять коллекции предложений и избранное при toggleFavoriteStatusAction.fulfilled', () => {
    const baseState = makeInitialState();

    const offer = { ...offers[0], isFavorite: false };
    const updatedOffer = { ...offer, isFavorite: true };

    const initialState: OffersState = {
      ...baseState,
      offers: [offer],
      nearbyOffers: [offer],
      favorites: [],
      currentOffer: offer,
    };

    const result = reducer(initialState, {
      type: toggleFavoriteStatusAction.fulfilled.type,
      payload: updatedOffer,
    });

    expect(result.offers[0]).toEqual(updatedOffer);
    expect(result.nearbyOffers[0]).toEqual(updatedOffer);
    expect(result.currentOffer).toEqual(updatedOffer);
    expect(result.favorites).toEqual([updatedOffer]);
  });
});
