import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useNavigate } from 'react-router-dom'

interface AppState {
    // Thêm các state cần thiết ở đây
    userData: any
    chatData: any
}

const initialState: AppState = {
    // Khởi tạo giá trị ban đầu
    userData: null,
    chatData: null
}

export const loadUserData = createAsyncThunk(
    'app/loadUserData',
    async (uid: string, { dispatch }) => {
        const userDoc = await getDoc(doc(db, "users", uid));
        const userData = userDoc.data();
        return { userData, redirect: userData?.avatar && userData?.name ? '/chat' : '/profile-update' };
    }
);

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<any>) => {
            state.userData = action.payload
        },
        setChatData: (state, action: PayloadAction<any>) => {
            state.chatData = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadUserData.fulfilled, (state, action) => {
            state.userData = action.payload.userData;
        });
    }
});

export const { setUserData, setChatData } = appSlice.actions
export default appSlice.reducer 