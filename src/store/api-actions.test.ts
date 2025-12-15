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
import { offers } from '../mocks/offers';
import { reviews } from '../mocks/reviews';

// В этом файле не тестируем операции, которые используют localStorage
// (checkAuthAction, loginAction, logoutAction).

type RootState = unknown;

describe('Асинхронные действия', () => {
  const makeApi = () => {
    const api = axios.create();
    const mockApi = new MockAdapter(api);

    return { api, mockApi } as const;
  };

  it('fetchOffersAction должен запрашивать предложения с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({} as RootState));

    mockApi.onGet('/six-cities/offers').reply(200, offers);

    const thunk = fetchOffersAction();

    await thunk(dispatch, getState, api);

    const actions = dispatch.mock.calls.map(([action]) => action);

    expect(actions[0].type).toBe(fetchOffersAction.pending.type);
    expect(actions[1].type).toBe(fetchOffersAction.fulfilled.type);
    expect(actions[1].payload).toEqual(offers);
  });

  it('fetchOfferAction должен запрашивать одно предложение с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({} as RootState));

    const offerId = '1';
    const offer = offers[0];

    mockApi
      .onGet(`/six-cities/offers/${offerId}`)
      .reply(200, offer);

    const thunk = fetchOfferAction(offerId);

    await thunk(dispatch, getState, api);

    const actions = dispatch.mock.calls.map(([action]) => action);

    expect(actions[0].type).toBe(fetchOfferAction.pending.type);
    expect(actions[1].type).toBe(fetchOfferAction.fulfilled.type);
    expect(actions[1].payload).toEqual(offer);
  });

  it('fetchNearbyOffersAction должен запрашивать соседние предложения с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({} as RootState));

    const offerId = '1';

    mockApi
      .onGet(`/six-cities/offers/${offerId}/nearby`)
      .reply(200, offers);

    const thunk = fetchNearbyOffersAction(offerId);

    await thunk(dispatch, getState, api);

    const actions = dispatch.mock.calls.map(([action]) => action);

    expect(actions[0].type).toBe(fetchNearbyOffersAction.pending.type);
    expect(actions[1].type).toBe(fetchNearbyOffersAction.fulfilled.type);
    expect(actions[1].payload).toEqual(offers);
  });

  it('fetchCommentsAction должен запрашивать комментарии с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({} as RootState));

    const offerId = '1';

    mockApi
      .onGet(`/six-cities/comments/${offerId}`)
      .reply(200, reviews);

    const thunk = fetchCommentsAction(offerId);

    await thunk(dispatch, getState, api);

    const actions = dispatch.mock.calls.map(([action]) => action);

    expect(actions[0].type).toBe(fetchCommentsAction.pending.type);
    expect(actions[1].type).toBe(fetchCommentsAction.fulfilled.type);
    expect(actions[1].payload).toEqual(reviews);
  });

  it('postCommentAction должен отправлять комментарий на API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({} as RootState));

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

    const actions = dispatch.mock.calls.map(([action]) => action);

    expect(actions[0].type).toBe(postCommentAction.pending.type);
    expect(actions[1].type).toBe(postCommentAction.fulfilled.type);
    expect(actions[1].payload).toEqual(createdReview);
  });

  it('fetchFavoritesAction должен запрашивать избранное с API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({} as RootState));

    mockApi
      .onGet('/six-cities/favorite')
      .reply(200, offers);

    const thunk = fetchFavoritesAction();

    await thunk(dispatch, getState, api);

    const actions = dispatch.mock.calls.map(([action]) => action);

    expect(actions[0].type).toBe(fetchFavoritesAction.pending.type);
    expect(actions[1].type).toBe(fetchFavoritesAction.fulfilled.type);
    expect(actions[1].payload).toEqual(offers);
  });

  it('toggleFavoriteStatusAction должен переключать статус избранного через API', async () => {
    const { api, mockApi } = makeApi();
    const dispatch = vi.fn();
    const getState = vi.fn(() => ({} as RootState));

    const data = { offerId: '1', status: 1 as const };
    const updatedOffer = { ...offers[0], isFavorite: true };

    mockApi
      .onPost(`/six-cities/favorite/${data.offerId}/${data.status}`)
      .reply(200, updatedOffer);

    const thunk = toggleFavoriteStatusAction(data);

    await thunk(dispatch, getState, api);

    const actions = dispatch.mock.calls.map(([action]) => action);

    expect(actions[0].type).toBe(toggleFavoriteStatusAction.pending.type);
    expect(actions[1].type).toBe(toggleFavoriteStatusAction.fulfilled.type);
    expect(actions[1].payload).toEqual(updatedOffer);
  });
});
