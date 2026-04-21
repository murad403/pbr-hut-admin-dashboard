import baseApi from "@/redux/api/baseApi";
import type { DashboardApiResponse, DashboardData, GetMenuItemsQueryParams, GetOrdersQueryParams, MenuCategory, MenuItemEntity, MenuItemsResponse, MenuItemsResponseEnvelope, OrderDetails, OrderDetailsResponseEnvelope, OrdersResponse, OrdersResponseEnvelope, UpsertMenuItemWithImagePayload } from "./dashboard.type";


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
        getCategories: builder.query<MenuCategory[], void>({
            query: () => {
                return {
                    url: `/categories`,
                    method: "GET"
                }
            },
            transformResponse: (response: DashboardApiResponse<MenuCategory[]>) => response.data,
        }),
        getAllMenuItems: builder.query<MenuItemsResponse, GetMenuItemsQueryParams>({
            query: (params) => {
                return {
                    url: `/items`,
                    method: "GET",
                    params,
                }
            },
            transformResponse: (response: MenuItemsResponseEnvelope, _meta, arg) => ({
                data: response.data,
                pagination: response.meta?.pagination ?? response.pagination ?? {
                    page: arg.page,
                    limit: arg.limit,
                    total: response.data.length,
                    totalPages: 1,
                },
            }),
            providesTags: ["item"]
        }),
        getMenuItem: builder.query<MenuItemEntity, string>({
            query: (itemId) => {
                return {
                    url: `/items/${itemId}`,
                    method: "GET"
                }
            },
            transformResponse: (response: DashboardApiResponse<MenuItemEntity>) => response.data,
            providesTags: ["item"],
        }),
        addMenuItem: builder.mutation<MenuItemEntity, UpsertMenuItemWithImagePayload>({
            query: ({ data, image }) => {
                const formData = new FormData();
                formData.append("data", JSON.stringify(data));
                if (image) {
                    formData.append("image", image);
                }
                return {
                    url: `/items`,
                    method: "POST",
                    body: formData
                }
            },
            transformResponse: (response: DashboardApiResponse<MenuItemEntity>) => response.data,
            invalidatesTags: ["item"]
        }),
        updateMenuItem: builder.mutation<MenuItemEntity, { itemId: string; data: UpsertMenuItemWithImagePayload }>({
            query: ({ itemId, data }) => {
                const formData = new FormData();
                formData.append("data", JSON.stringify(data.data));
                if (data.image) {
                    formData.append("image", data.image);
                }
                return {
                    url: `/items/${itemId}`,
                    method: "PATCH",
                    body: formData
                }
            },
            transformResponse: (response: DashboardApiResponse<MenuItemEntity>) => response.data,
            invalidatesTags: ["item"]
        }),
        deleteMenuItem: builder.mutation<null, string>({
            query: (itemId) => {
                return {
                    url: `/items/${itemId}`,
                    method: "DELETE"
                }
            },
            transformResponse: () => null,
            invalidatesTags: ["item"]
        }),




        // banner ads----------------------
        getBannerAds: builder.query({
            query: () => {
                return {
                    url: `/ads`,
                    method: "GET"
                }
            },
            providesTags: ["ads"]
        }),
        addBannerAds: builder.mutation({
            query: (data) => {
                return {
                    url: `/ads`,
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["ads"]
        }),
        deleteBannerAds: builder.mutation({
            query: (adsId) => {
                return {
                    url: `/ads/${adsId}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: ["ads"]
        }),
    })
})



export const {
    useGetDashboardQuery,
    useGetOrdersQuery,
    useOrderDetailsQuery,
    useGetCategoriesQuery,
    useGetAllMenuItemsQuery,
    useGetMenuItemQuery,
    useAddMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} = dashboardApi;