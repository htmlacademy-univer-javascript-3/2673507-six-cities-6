import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import { changeCity, loadOffers } from './action';

export type OffersState = {
  city: string;
  offers: Offer[];
};

const initialState: OffersState = {
  city: 'Paris',
  offers: [],
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
    });
});
