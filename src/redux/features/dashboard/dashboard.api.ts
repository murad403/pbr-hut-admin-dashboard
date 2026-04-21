import baseApi from "@/redux/api/baseApi";
import type { DashboardApiResponse, DashboardData, GetMenuItemsQueryParams, GetOrdersQueryParams, MenuCategory, MenuItemEntity, MenuItemsResponse, MenuItemsResponseEnvelope, OrderDetails, OrderDetailsResponseEnvelope, OrdersResponse, OrdersResponseEnvelope, UpsertMenuItemPayload } from "./dashboard.type";


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
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: "item" as const, id })),
                        { type: "item" as const, id: "LIST" },
                    ]
                    : [{ type: "item" as const, id: "LIST" }],
        }),
        getMenuItem: builder.query<MenuItemEntity, string>({
            query: (itemId) => {
                return {
                    url: `/items/${itemId}`,
                    method: "GET"
                }
            },
            transformResponse: (response: DashboardApiResponse<MenuItemEntity>) => response.data,
            providesTags: (_result, _error, itemId) => [{ type: "item" as const, id: itemId }],
        }),
        addMenuItem: builder.mutation<MenuItemEntity, UpsertMenuItemPayload>({
            query: (data) => {
                return {
                    url: `/items`,
                    method: "POST",
                    body: data
                }
            },
            transformResponse: (response: DashboardApiResponse<MenuItemEntity>) => response.data,
            invalidatesTags: [{ type: "item", id: "LIST" }],
        }),
        updateMenuItem: builder.mutation<MenuItemEntity, { itemId: string; data: UpsertMenuItemPayload }>({
            query: ({ itemId, data }) => {
                return {
                    url: `/items/${itemId}`,
                    method: "PATCH",
                    body: data
                }
            },
            transformResponse: (response: DashboardApiResponse<MenuItemEntity>) => response.data,
            invalidatesTags: (_result, _error, arg) => [
                { type: "item", id: arg.itemId },
                { type: "item", id: "LIST" },
            ],
        }),
        deleteMenuItem: builder.mutation<null, string>({
            query: (itemId) => {
                return {
                    url: `/items/${itemId}`,
                    method: "DELETE"
                }
            },
            transformResponse: () => null,
            invalidatesTags: (_result, _error, itemId) => [
                { type: "item", id: itemId },
                { type: "item", id: "LIST" },
            ],
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