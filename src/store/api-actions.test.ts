import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  fetchOffersAction,
  fetchOfferAction,
  fetchNearbyOffersAction,
  fetchCommentsAction,
  postCommentAction,
  fetchFavoritesAction,
  toggleFavoriteStatusAction,
} from './api-actions';
import type { RootState } from './index';
import { offers } from '../mocks/offers';
import { reviews } from '../mocks/reviews';

// В этом файле не тестируем операции, которые используют localStorage
// (checkAuthAction, loginAction, logoutAction).

describe('Асинхронные действия', () => {
  const makeApi = () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);

    return { api, mockApi } as const;
  };

  it('fetchOffersAction должен запрашивать предложения с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn<[], RootState>(() => ({} as RootState));

    mockApi.onGet('/six-cities/offers').reply(200, offers);

    const thunk = fetchOffersAction();

    await thunk(dispatch, getState, api);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: fetchOffersAction.pending.type })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: fetchOffersAction.fulfilled.type,
        payload: offers,
      })
    );
  });

  it('fetchOfferAction должен запрашивать одно предложение с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn<[], RootState>(() => ({} as RootState));

    const offerId = '1';
    const offer = offers[0];

    mockApi
      .onGet(`/six-cities/offers/${offerId}`)
      .reply(200, offer);

    const thunk = fetchOfferAction(offerId);

    await thunk(dispatch, getState, api);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: fetchOfferAction.pending.type })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: fetchOfferAction.fulfilled.type,
        payload: offer,
      })
    );
  });

  it('fetchNearbyOffersAction должен запрашивать соседние предложения с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn<[], RootState>(() => ({} as RootState));

    const offerId = '1';

    mockApi
      .onGet(`/six-cities/offers/${offerId}/nearby`)
      .reply(200, offers);

    const thunk = fetchNearbyOffersAction(offerId);

    await thunk(dispatch, getState, api);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: fetchNearbyOffersAction.pending.type })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: fetchNearbyOffersAction.fulfilled.type,
        payload: offers,
      })
    );
  });

  it('fetchCommentsAction должен запрашивать комментарии с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn<[], RootState>(() => ({} as RootState));

    const offerId = '1';

    mockApi
      .onGet(`/six-cities/comments/${offerId}`)
      .reply(200, reviews);

    const thunk = fetchCommentsAction(offerId);

    await thunk(dispatch, getState, api);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: fetchCommentsAction.pending.type })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: fetchCommentsAction.fulfilled.type,
        payload: reviews,
      })
    );
  });

  it('postCommentAction должен отправлять комментарий на API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn<[], RootState>(() => ({} as RootState));

    const commentData = {
      offerId: '1',
      comment: 'Test comment',
      rating: 5,
    };

    const createdReview = { ...reviews[0], ...commentData };

    mockApi
      .onPost(`/six-cities/comments/${commentData.offerId}`)
      .reply(200, createdReview);

    const thunk = postCommentAction(commentData);

    await thunk(dispatch, getState, api);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: postCommentAction.pending.type })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: postCommentAction.fulfilled.type,
        payload: createdReview,
      })
    );
  });

  it('fetchFavoritesAction должен запрашивать избранное с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn<[], RootState>(() => ({} as RootState));

    mockApi
      .onGet('/six-cities/favorite')
      .reply(200, offers);

    const thunk = fetchFavoritesAction();

    await thunk(dispatch, getState, api);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: fetchFavoritesAction.pending.type })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: fetchFavoritesAction.fulfilled.type,
        payload: offers,
      })
    );
  });

  it('toggleFavoriteStatusAction должен переключать статус избранного через API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn<[], RootState>(() => ({} as RootState));

    const data = { offerId: '1', status: 1 as const };
    const updatedOffer = { ...offers[0], isFavorite: true };

    mockApi
      .onPost(`/six-cities/favorite/${data.offerId}/${data.status}`)
      .reply(200, updatedOffer);

    const thunk = toggleFavoriteStatusAction(data);

    await thunk(dispatch, getState, api);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: toggleFavoriteStatusAction.pending.type })
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: toggleFavoriteStatusAction.fulfilled.type,
        payload: updatedOffer,
      })
    );
  });
});
