import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { client } from "app/client"
import { RootState } from "app/store"
import { ReadingMode, ReadingOrder, Settings, UserModel } from "app/types"

interface UserState {
    settings?: Settings
    profile?: UserModel
}

const initialState: UserState = {}

export const reloadSettings = createAsyncThunk("settings/reload", () => client.user.getSettings().then(r => r.data))
export const reloadProfile = createAsyncThunk("profile/reload", () => client.user.getProfile().then(r => r.data))
export const changeReadingMode = createAsyncThunk<void, ReadingMode, { state: RootState }>(
    "settings/readingMode",
    (readingMode, thunkApi) => {
        const { settings } = thunkApi.getState().user
        if (!settings) return
        client.user.saveSettings({ ...settings, readingMode })
    }
)
export const changeReadingOrder = createAsyncThunk<void, ReadingOrder, { state: RootState }>(
    "settings/readingOrder",
    (readingOrder, thunkApi) => {
        const { settings } = thunkApi.getState().user
        if (!settings) return
        client.user.saveSettings({ ...settings, readingOrder })
    }
)

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(reloadSettings.fulfilled, (state, action) => {
            state.settings = action.payload
        })
        builder.addCase(reloadProfile.fulfilled, (state, action) => {
            state.profile = action.payload
        })
        builder.addCase(changeReadingMode.pending, (state, action) => {
            if (!state.settings) return
            state.settings.readingMode = action.meta.arg
        })
        builder.addCase(changeReadingOrder.pending, (state, action) => {
            if (!state.settings) return
            state.settings.readingOrder = action.meta.arg
        })
    },
})

export default userSlice.reducer
