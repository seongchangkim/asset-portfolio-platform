import { createSlice } from "@reduxjs/toolkit";

const MemberSlice = createSlice({
    name: "member",
    initialState : {
        memberState: {}
    },
    reducers : {
        setMemberState: (state, action) => {
            state.memberState = action.payload
        }
    }
});

export const { setMemberState } = MemberSlice.actions;

export const getMemberState = (state) => state.member.memberState; 

export default MemberSlice;