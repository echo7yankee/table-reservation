import { configureStore } from "@reduxjs/toolkit";
// Import your reducers here
// import counterReducer from '../features/counter/counterSlice';

const store = configureStore({
    reducer: {
        // Add your reducers here
        // counter: counterReducer,
    },
});

export default store;
