import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserState {
    name: string
    lastName: string
    country: string
    picture: string
    id: number
}

let initialState: UserState[] = []

const usersSlice = createSlice({
    name: 'users',
    reducers: {
        deleteUserById: (state, action: PayloadAction<number>) => {
            
            return state.filter((user) => user.id !== action.payload)
        },
        setUsersState: (state, action: PayloadAction<Array<UserState>>) => {
            initialState = action.payload
            return action.payload
        },
        
        resetState: () => {
            return initialState
        }
    },
    initialState
})

export const { deleteUserById, setUsersState, resetState} = usersSlice.actions

export default usersSlice.reducer