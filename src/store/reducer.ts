import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import {
  AuthorizationStatus,
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
} from './api-actions';

export type OffersState = {
  city: string;
  offers: Offer[];
  isOffersLoading: boolean;
  authorizationStatus: AuthorizationStatus;
  userEmail: string | null;
  currentOffer: Offer | null;
  isCurrentOfferLoading: boolean;
  isCurrentOfferNotFound: boolean;
  nearbyOffers: Offer[];
  areNearbyOffersLoading: boolean;
  reviews: Review[];
  areReviewsLoading: boolean;
  isReviewPosting: boolean;
};

const initialState: OffersState = {
  city: 'Paris',
  offers: [],
  isOffersLoading: false,
  authorizationStatus: 'Unknown',
  userEmail: null,
  currentOffer: null,
  isCurrentOfferLoading: false,
  isCurrentOfferNotFound: false,
  nearbyOffers: [],
  areNearbyOffersLoading: false,
  reviews: [],
  areReviewsLoading: false,
  isReviewPosting: false,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUserEmail, (state, action) => {
      state.userEmail = action.payload;
    })
    .addCase(fetchOffersAction.pending, (state) => {
      state.isOffersLoading = true;
    })
    .addCase(fetchOffersAction.fulfilled, (state, action) => {
      state.offers = action.payload;
      state.isOffersLoading = false;
    })
    .addCase(fetchOffersAction.rejected, (state) => {
      state.isOffersLoading = false;
    })
    .addCase(fetchOfferAction.pending, (state) => {
      state.isCurrentOfferLoading = true;
      state.isCurrentOfferNotFound = false;
      state.currentOffer = null;
    })
    .addCase(fetchOfferAction.fulfilled, (state, action) => {
      state.currentOffer = action.payload;
      state.isCurrentOfferLoading = false;
      state.isCurrentOfferNotFound = false;
    })
    .addCase(fetchOfferAction.rejected, (state) => {
      state.currentOffer = null;
      state.isCurrentOfferLoading = false;
      state.isCurrentOfferNotFound = true;
    })
    .addCase(fetchNearbyOffersAction.pending, (state) => {
      state.areNearbyOffersLoading = true;
      state.nearbyOffers = [];
    })
    .addCase(fetchNearbyOffersAction.fulfilled, (state, action) => {
      state.nearbyOffers = action.payload;
      state.areNearbyOffersLoading = false;
    })
    .addCase(fetchNearbyOffersAction.rejected, (state) => {
      state.areNearbyOffersLoading = false;
      state.nearbyOffers = [];
    })
    .addCase(fetchCommentsAction.pending, (state) => {
      state.areReviewsLoading = true;
    })
    .addCase(fetchCommentsAction.fulfilled, (state, action) => {
      state.reviews = action.payload;
      state.areReviewsLoading = false;
    })
    .addCase(fetchCommentsAction.rejected, (state) => {
      state.areReviewsLoading = false;
      state.reviews = [];
    })
    .addCase(postCommentAction.pending, (state) => {
      state.isReviewPosting = true;
    })
    .addCase(postCommentAction.fulfilled, (state, action) => {
      state.isReviewPosting = false;
      state.reviews = [action.payload, ...state.reviews];
    })
    .addCase(postCommentAction.rejected, (state) => {
      state.isReviewPosting = false;
    });
});
