import baseApi from "@/redux/api/baseApi";
import type { ApproveRiderPayload, BannerAd, DashboardApiResponse, DashboardData, DeclineRiderPayload, GetMenuItemsQueryParams, GetOrdersQueryParams, GetRidersQueryParams, MenuCategory, MenuItemEntity, MenuItemsResponse, MenuItemsResponseEnvelope, OrderDetails, OrderDetailsResponseEnvelope, OrdersResponse, OrdersResponseEnvelope, RiderNidActionEntity, RiderNidActionResponseEnvelope, RidersResponse, RidersResponseEnvelope, RestaurantProfile, RestaurantProfileResponseEnvelope, UpdateProfilePayload, UpsertMenuItemWithImagePayload, Category, SubCategory } from "./dashboard.type";


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
        getBannerAds: builder.query<BannerAd[], void>({
            query: () => {
                return {
                    url: `/ads`,
                    method: "GET"
                }
            },
            transformResponse: (response: DashboardApiResponse<BannerAd[]>) => response.data,
            providesTags: ["ads"]
        }),
        addBannerAds: builder.mutation<BannerAd, FormData>({
            query: (data) => {
                return {
                    url: `/ads`,
                    method: "POST",
                    body: data
                }
            },
            transformResponse: (response: DashboardApiResponse<BannerAd>) => response.data,
            invalidatesTags: ["ads"]
        }),
        deleteBannerAds: builder.mutation<null, string>({
            query: (adsId) => {
                return {
                    url: `/ads/${adsId}`,
                    method: "DELETE"
                }
            },
            transformResponse: () => null,
            invalidatesTags: ["ads"]
        }),


        // riders ---------------------
        getRiders: builder.query<RidersResponse, GetRidersQueryParams>({
            query: (params) => {
                return {
                    url: `/admin/riders`,
                    method: "GET",
                    params,
                }
            },
            transformResponse: (response: RidersResponseEnvelope) => ({
                data: response.data,
                pagination: response.pagination,
            }),
            providesTags: ["riders"]
        }),
        approveRider: builder.mutation<RiderNidActionEntity, ApproveRiderPayload>({
            query: (data) => {
                return {
                    url: `/admin/riders/nid/approve`,
                    method: "POST",
                    body: data
                }
            },
            transformResponse: (response: RiderNidActionResponseEnvelope) => response.data,
            invalidatesTags: ["riders"]
        }),
        declineRider: builder.mutation<RiderNidActionEntity, DeclineRiderPayload>({
            query: (data) => {
                return {
                    url: `/admin/riders/nid/decline`,
                    method: "POST",
                    body: data
                }
            },
            transformResponse: (response: RiderNidActionResponseEnvelope) => response.data,
            invalidatesTags: ["riders"]
        }),


        // settings --------------------------------
        getProfile: builder.query<RestaurantProfile, void>({
            query: () => {
                return {
                    url: `/restaurant/primary`,
                    method: "GET"
                }
            },
            transformResponse: (response: RestaurantProfileResponseEnvelope) => response.data,
            providesTags: ["profile"],
        }),
        updateProfile: builder.mutation<RestaurantProfile, UpdateProfilePayload>({
            query: (data) => {
                return {
                    url: `/restaurant/primary`,
                    method: "POST",
                    body: data
                }
            },
            transformResponse: (response: RestaurantProfileResponseEnvelope) => response.data,
            invalidatesTags: ["profile"],
        }),


        listCategories: builder.query<Category[], void>({
            query: () => ({ url: "/categories", method: "GET" }),
            transformResponse: (res: DashboardApiResponse<Category[]>) => res.data,
            providesTags: ["category"],
        }),
        createCategory: builder.mutation<Category, { name: string }>({
            query: (body) => ({ url: "/categories", method: "POST", body }),
            transformResponse: (res: DashboardApiResponse<Category>) => res.data,
            invalidatesTags: ["category"],
        }),
        updateCategory: builder.mutation<Category, { id: string; name: string }>({
            query: ({ id, name }) => ({
                url: `/categories/${id}`,
                method: "PATCH",
                body: { name },
            }),
            transformResponse: (res: DashboardApiResponse<Category>) => res.data,
            invalidatesTags: ["category"],
        }),
        deleteCategory: builder.mutation<null, string>({
            query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
            transformResponse: () => null,
            invalidatesTags: ["category"],
        }),
        createSubCategory: builder.mutation<
            SubCategory,
            { categoryId: string; name: string }
        >({
            query: ({ categoryId, name }) => ({
                url: `/categories/${categoryId}/sub-categories`,
                method: "POST",
                body: { name },
            }),
            transformResponse: (res: DashboardApiResponse<SubCategory>) => res.data,
            invalidatesTags: ["category"],
        }),
        updateSubCategory: builder.mutation<
            SubCategory,
            { subId: string; name: string }
        >({
            query: ({ subId, name }) => ({
                url: `/categories/sub-categories/${subId}`,
                method: "PATCH",
                body: { name },
            }),
            transformResponse: (res: DashboardApiResponse<SubCategory>) => res.data,
            invalidatesTags: ["category"],
        }),
        deleteSubCategory: builder.mutation<null, string>({
            query: (subId) => ({
                url: `/categories/sub-categories/${subId}`,
                method: "DELETE",
            }),
            transformResponse: () => null,
            invalidatesTags: ["category"],
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
    useGetBannerAdsQuery,
    useAddBannerAdsMutation,
    useDeleteBannerAdsMutation,
    useGetRidersQuery,
    useApproveRiderMutation,
    useDeclineRiderMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useListCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useCreateSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,
} = dashboardApi;