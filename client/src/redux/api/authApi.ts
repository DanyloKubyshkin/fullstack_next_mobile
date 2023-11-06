import { setUserInfo } from "@/service/auth.service";
import { baseApi } from "./baseApi"
import { userLoggedIn } from "../slice/userSlice";

const AUTH_URL = '/auth'

export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        userLogin: build.mutation({
            query: (loginData) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                data: loginData,
            }),
            async onQueryStarted(arg, {queryFulfilled,dispatch}) {
                try {
                    const result = (await queryFulfilled).data;
                    setUserInfo({accessToken: result.accessToken});
                    dispatch(userLoggedIn(result.user))
                } catch (error) {
                    console.log(error)
                }
            },
        }),
        userSignUp: build.mutation({
            query: (loginData) => ({
                url: `${AUTH_URL}/signup`,
                method: 'POST',
                data: loginData,
            }),
        }),
    })
})

export const { useUserLoginMutation, useUserSignUpMutation } = authApi