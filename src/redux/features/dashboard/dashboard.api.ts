import baseApi from "@/redux/api/baseApi";
import type {
    DashboardApiResponse,
    DashboardData,
    GetOrdersQueryParams,
    OrderDetails,
    OrderDetailsResponseEnvelope,
    OrdersResponse,
    OrdersResponseEnvelope,
} from "./dashboard.type";


const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // dashboard-------------------
        getDashboard: builder.query<DashboardData, void>({
            query: () => {
                return {
                    url: "/admin/dashboard",
                    method: "GET"
                }
            },
            transformResponse: (response: DashboardApiResponse<DashboardData>) => response.data,
        }),


        // orders----------------------
        getOrders: builder.query<OrdersResponse, GetOrdersQueryParams>({
            query: (params) => {
                return {
                    url: "/admin/orders",
                    method: "GET",
                    params,
                }
            },
            transformResponse: (response: OrdersResponseEnvelope) => ({
                data: response.data,
                pagination: response.pagination,
            }),
        }),
        orderDetails: builder.query<OrderDetails, string>({
            query: (orderId: string) => {
                return {
                    url: `/orders/${orderId}`,
                    method: "GET"
                }
            },
            transformResponse: (response: OrderDetailsResponseEnvelope) => response.data,
        }),


        // menu and catalog----------------------------
        getCategories: builder.query({
            query: () => {
                return {
                    url: `/categories`,
                    method: "GET"
                }
            }
        }),


    })
})



export const {
    useGetDashboardQuery,
    useGetOrdersQuery,
    useOrderDetailsQuery
} = dashboardApi;