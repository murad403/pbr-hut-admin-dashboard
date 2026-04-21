export type DashboardApiResponse<T> = {
	success: boolean;
	statusCode: number;
	message: string;
	data: T;
};

export type DashboardStats = {
	todayOrders: number;
	orderTotal: string;
	activeOrders: number;
	pending: number;
	cancelled: number;
	delivered: number;
	revenue: string;
};

export type WeeklyRevenuePoint = {
	day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
	revenue: string;
};

export type OrdersByCategoryPoint = {
	category: string;
	count: number;
};

export type RecentOrder = {
	id: string;
	orderNumber: string;
	customerName: string;
	itemsQty: number;
	orderTotal: string;
	status: string;
	time: string;
};

export type TopSellingItem = {
	itemName: string;
	category: string;
	unitsSold: number;
};

export type DashboardData = {
	stats: DashboardStats;
	weeklyRevenue: WeeklyRevenuePoint[];
	ordersByCategory: OrdersByCategoryPoint[];
	recentOrders: RecentOrder[];
	topSellingItems: TopSellingItem[];
};

export type OrderStatusApi =
	| 'PENDING'
	| 'CONFIRMED'
	| 'PREPARING'
	| 'READY_FOR_PICKUP'
	| 'OUT_FOR_DELIVERY'
	| 'DELIVERED'
	| 'PICKED_UP'
	| 'CANCELLED'
	| 'SCHEDULED';

export type OrderTypeApi = 'DELIVERY' | 'PICKUP';

export type PaymentMethodApi = 'CARD' | 'CASH_ON_DELIVERY';

export type OrdersPagination = {
	limit: number;
	page: number;
	total: number;
	totalPages: number;
};

export type OrderDeliveryAddress = {
	id: string;
	orderId: string;
	locationLabel: string;
	name: string;
	phoneNumber: string;
	address: string;
	buildingDetail: string;
	latitude: number;
	longitude: number;
};

export type OrderBillingAddress = {
	id: string;
	orderId: string;
	country: string;
	addressLine1: string;
	addressLine2: string;
	suburb: string;
	city: string;
	postalCode: string;
	state: string;
};

export type OrderItemExtra = {
	id: string;
	orderItemId: string;
	extraName: string;
	price: string;
};

export type OrderItem = {
	id: string;
	orderId: string;
	itemId: string;
	itemName: string;
	imageUrl: string;
	quantity: number;
	customNote: string;
	sizeName: string;
	sideOptionName: string;
	sizePrice: string;
	sidePrice: string;
	unitPrice: string;
	totalPrice: string;
	extras: OrderItemExtra[];
};

export type OrderSummary = {
	id: string;
	userId: string;
	assignedRiderId: string | null;
	h3Index: string;
	orderNumber: string;
	confirmationCode: string;
	type: OrderTypeApi;
	status: OrderStatusApi;
	paymentMethod: PaymentMethodApi;
	paymentStatus: string;
	deliveryTiming: string;
	scheduledAt: string | null;
	estimatedArrivalAt: string | null;
	deliveredAt: string | null;
	itemsTotal: string;
	deliveryCharge: string;
	taxes: string;
	totalAmount: string;
	createdAt: string;
	updatedAt: string;
	deliveryAddress: OrderDeliveryAddress;
	items: OrderItem[];
};

export type OrderDetails = OrderSummary & {
	billingAddress?: OrderBillingAddress;
};

export type OrdersResponse = {
	pagination: OrdersPagination;
	data: OrderSummary[];
};

export type OrdersResponseEnvelope = {
	success: boolean;
	statusCode: number;
	message: string;
	pagination: OrdersPagination;
	data: OrderSummary[];
};

export type OrderDetailsResponseEnvelope = DashboardApiResponse<OrderDetails>;

export type GetOrdersQueryParams = {
	page: number;
	limit: number;
	status?: OrderStatusApi;
	searchTerm?: string;
};
