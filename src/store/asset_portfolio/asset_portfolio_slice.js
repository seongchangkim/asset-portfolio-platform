import { createSlice } from "@reduxjs/toolkit";

const AssetPortfolioSlice = createSlice({
    name: "assetPortfolio",
    initialState : {
        assetPortfolioState: {}
    },
    reducers: {
        setAssetPortfolioState: (state, action) => {
            state.assetPortfolioState = action.payload
        }
    }
});

export const { setAssetPortfolioState } = AssetPortfolioSlice.actions;

export const getAssetPortfolioState = (state) => state.assetPortfolio.assetPortfolioState;

export default AssetPortfolioSlice;