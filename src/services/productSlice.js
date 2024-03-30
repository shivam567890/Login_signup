import { createSlice } from '@reduxjs/toolkit';

const initialState={
  isProductAvailable: false,
  productData:null,

}
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    productSuccess(state, action) {
      state.isProductAvailable = true;
      state.productData = action.payload;
    },
  }
});

export const { productSuccess } = productSlice.actions;
export default productSlice.reducer;
