import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { AppDispatch, RootState } from '.';
import { requireAuthorization, setUserEmail } from './action';
import { dropToken, saveToken } from '../api';

type ThunkApiConfig = {
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
};

type AuthInfo = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
  email: string;
  token: string;
};

type AuthData = {
  email: string;
  password: string;
};

export const fetchOffersAction = createAsyncThunk<
  Offer[],
  undefined,
  ThunkApiConfig
>('offers/fetchOffers', async (_arg, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/six-cities/offers');
  return data;
});

export const checkAuthAction = createAsyncThunk<
  void,
  undefined,
  ThunkApiConfig
>('user/checkAuth', async (_arg, { dispatch, extra: api }) => {
  try {
    const { data } = await api.get<AuthInfo>('/six-cities/login');
    saveToken(data.token);
    dispatch(setUserEmail(data.email));
    dispatch(requireAuthorization('Auth'));
  } catch {
    dispatch(setUserEmail(null));
    dispatch(requireAuthorization('NoAuth'));
  }
});

export const loginAction = createAsyncThunk<void, AuthData, ThunkApiConfig>(
  'user/login',
  async ({ email, password }, { dispatch, extra: api }) => {
    const { data } = await api.post<AuthInfo>('/six-cities/login', {
      email,
      password,
    });

    saveToken(data.token);
    dispatch(setUserEmail(data.email));
    dispatch(requireAuthorization('Auth'));
  }
);

export const fetchOfferAction = createAsyncThunk<Offer, string, ThunkApiConfig>(
  'offer/fetchOffer',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offer>(`/six-cities/offers/${offerId}`);
    return data;
  }
);

export const fetchNearbyOffersAction = createAsyncThunk<
  Offer[],
  string,
  ThunkApiConfig
>('offer/fetchNearbyOffers', async (offerId, { extra: api }) => {
  const { data } = await api.get<Offer[]>(
    `/six-cities/offers/${offerId}/nearby`
  );
  return data;
});

export const fetchCommentsAction = createAsyncThunk<
  Review[],
  string,
  ThunkApiConfig
>('offer/fetchComments', async (offerId, { extra: api }) => {
  const { data } = await api.get<Review[]>(`/six-cities/comments/${offerId}`);
  return data;
});

type PostCommentData = {
  offerId: string;
  comment: string;
  rating: number;
};

export const postCommentAction = createAsyncThunk<
  Review,
  PostCommentData,
  ThunkApiConfig
>('offer/postComment', async ({ offerId, comment, rating }, { extra: api }) => {
  const { data } = await api.post<Review>(`/six-cities/comments/${offerId}`, {
    comment,
    rating,
  });

  return data;
});

export const logoutAction = createAsyncThunk<void, undefined, ThunkApiConfig>(
  'user/logout',
  async (_arg, { dispatch, extra: api }) => {
    await api.delete('/six-cities/logout');
    dropToken();
    dispatch(setUserEmail(null));
    dispatch(requireAuthorization('NoAuth'));
  }
);
