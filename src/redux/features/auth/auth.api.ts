import baseApi from "@/redux/api/baseApi";
import type {
    ChangePasswordRequest,
    ChangePasswordResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    SignInRequest,
    SignInResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
} from "./auth.type";


const authApi = baseApi.injectEndpoints({
    endpoints: (builder) =>({
        signIn: builder.mutation<SignInResponse, SignInRequest>({
            query: (data) =>{
                // console.log("api call", data)
                return {
                    url: "/auth/login",
                    method: "POST",
                    body: data
                }
            },
            transformResponse: (response: {
                success: boolean;
                statusCode: number;
                message: string;
                data: SignInResponse;
            }) => response.data,
        }),
        forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
            query: (data) =>{
                return {
                    url: "/auth/forgot-password",
                    method: "POST",
                    body: data
                }
            },
            transformResponse: (response: {
                success: boolean;
                statusCode: number;
                message: string;
                data: ForgotPasswordResponse;
            }) => response.data,
        }),
        verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
            query: (data) =>{
                return {
                    url: "/auth/verify-otp",
                    method: "POST",
                    body: data
                }
            },
            transformResponse: (response: {
                success: boolean;
                statusCode: number;
                message: string;
                data: VerifyOtpResponse;
            }) => response.data,
        }),
        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
            query: (data) =>{
                return {
                    url: "/auth/reset-password",
                    method: "POST",
                    body: data
                }
            },
            transformResponse: () => null,
        }),
        changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
            query: (data) =>{
                return {
                    url: "/user/change-password",
                    method: "POST",
                    body: data
                }
            },
            transformResponse: () => null,
        }),
    })
})

export const {
    useSignInMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
} = authApi;

export default authApi;