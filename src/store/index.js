import { configureStore } from "@reduxjs/toolkit";
import MemberSlice from "./member/member_slice";
import AssetPortfolioSlice from "./asset_portfolio/asset_portfolio_slice";
import storage from 'redux-persist/lib/storage';
import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';

const reducer = combineReducers({
    member: MemberSlice.reducer,
    assetPortfolio: AssetPortfolioSlice.reducer
});

const persistConfig = {
    key: "root",
    storage: storage.default,
    whitelist: ["member", "assetPortfolio"]
}

const persistedReducer = persistReducer(persistConfig, reducer);

const Store = configureStore({
    reducer : persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
});

export default Store;
    