import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { doc, getDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useEffect } from 'react'
import { useAppDispatch } from '../hooks/redux'

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

        // Cập nhật lastSeen ban đầu với serverTimestamp
        await updateDoc(doc(db, "users", uid), {
            lastSeen: serverTimestamp()
        });

        // Tạo interval và lưu reference để có thể cleanup
        const intervalId = setInterval(async () => {
            try {
                await updateDoc(doc(db, "users", uid), {
                    lastSeen: serverTimestamp()
                });
            } catch (error) {
                console.error("Error updating lastSeen:", error);
                // Nếu có lỗi, dừng interval
                clearInterval(intervalId);
            }
        }, 1000 * 60); // Cập nhật mỗi phút
        // Lưu intervalId vào window object để có thể cleanup khi cần
        (window as any).__lastSeenInterval = intervalId;

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

// Tạo custom hook để lắng nghe chat data
export const useChatListener = (userData: any) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'chats', userData.id);
            const unsubscribe = onSnapshot(chatRef, async (snapshot) => {
                const chatData = snapshot.data()?.chatsData || {};
                const temp = [];

                for (const key in chatData) {
                    const user = await getDoc(doc(db, 'users', chatData[key].uid));
                    temp.push({
                        id: key,
                        ...chatData[key],
                        user: user.data()
                    });
                }

                dispatch(setChatData(temp.sort((a, b) => b.updatedAt - a.updatedAt)));
            });

            return () => unsubscribe();
        }
    }, [userData, dispatch]);
};

export const { setUserData, setChatData } = appSlice.actions
export default appSlice.reducer 