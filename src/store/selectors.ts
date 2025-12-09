import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

export const selectCity = (state: RootState) => state.city;
export const selectOffers = (state: RootState) => state.offers;
export const selectFavorites = (state: RootState) => state.favorites;
export const selectIsOffersLoading = (state: RootState) =>
  state.isOffersLoading;
export const selectAuthorizationStatus = (state: RootState) =>
  state.authorizationStatus;
export const selectUserEmail = (state: RootState) => state.userEmail;

export const selectCurrentOffer = (state: RootState) => state.currentOffer;
export const selectIsCurrentOfferLoading = (state: RootState) =>
  state.isCurrentOfferLoading;
export const selectIsCurrentOfferNotFound = (state: RootState) =>
  state.isCurrentOfferNotFound;
export const selectNearbyOffers = (state: RootState) => state.nearbyOffers;
export const selectAreNearbyOffersLoading = (state: RootState) =>
  state.areNearbyOffersLoading;
export const selectReviews = (state: RootState) => state.reviews;
export const selectAreReviewsLoading = (state: RootState) =>
  state.areReviewsLoading;
export const selectIsReviewPosting = (state: RootState) =>
  state.isReviewPosting;
export const selectAreFavoritesLoading = (state: RootState) =>
  state.areFavoritesLoading;

export const selectOffersByCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((o) => o.city.name === city)
);

export const selectFavoriteCount = createSelector(
  [selectFavorites],
  (favorites) => favorites.length
);
