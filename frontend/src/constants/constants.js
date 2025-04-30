export const APIEndpoints = Object.freeze({
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  LOGOUT: "/api/auth/logout",
  GETGOODSBYCATEGORIES: "/api/goods/getGoods",
  GETBRANCHES: "/api/branch/getBranches",
  GETACCESSIBLEBRANCHES: "/api/branch/getAccessibleBranches",
  ADDNEWBRANCH: "/api/branch/newBranch",
  DELETEBRANCH: "/api/branch/deleteBranch",
  UPDATEBRANCH: "/api/branch/updateBranch",
  GETCATEGORIESFROMBRANCHID: "/api/branch/getCategories",
  GETGOODSBYCATEGORYNAMES: "/api/goods/getGoods",
  DELETECATEGORIES: "/api/goods/deleteCategories",
  DELETEGOODS: "/api/goods/deleteGoods",
  MODIFYGOOD: "/api/goods/modifyGood",
  MODIFYCATEGORY: "/api/goods/modifyCategory",
  ADDGOODS: "/api/goods/addGoods",
  GETUSERSBYBRANCHID: "/api/auth/getUsersByBranchId",
  DELETEUSERBYID: "/api/auth/deleteUserById",
  CREATEUSER: "/api/auth/createUser",
  UPDATEUSER: "/api/auth/updateUser",
  ADDCATEGORY: "/api/goods/addCategory",
  GETCATEGORIESBYQUERY: "/api/goods/getCategoriesByQuery",
  GETGOODSBYQUERY: "/api/goods/getGoodsByQuery",
  CREATENEWBILL: "/api/billing/createNewBill",
  FETCHBILLS: "/api/billing/fetchBill",
  GETBILLSSALESSUMMARY: "/api/analytics/bill-sales-summary",
  GETBILLITEMSSALESSUMMARY: "/api/analytics/bill-items-sales-summary",
  GETBRANCHSUMMARY: "/api/analytics/branch-summary",
  GETSTOCKSUMMARY: "/api/analytics/stock-summary",
});

export const Roles = Object.freeze({
  ADMIN: "admin",
  BRANCHADMIN: "branchAdmin",
  BILLER: "biller",
});

export const HomepageNavigations = Object.freeze([
  {
    name: "Login",
    link: "/login",
  },
]);

export const PagesLink = Object.freeze({
  LANDING: {
    link: "/",
    name: "Home",
  },
  LOGIN: {
    link: "/login",
    name: "Login",
  },
  MANAGE_USERS: {
    link: "/manage-users",
    name: "Manage Users",
    Roles: [Roles.ADMIN],
  },
  MANAGE_GOODS: {
    link: "/manage-goods",
    name: "Manage Goods",
    Roles: [Roles.BRANCHADMIN],
  },
  BILLING: {
    link: "/billing",
    name: "Billing",
    Roles: [Roles.BILLER],
  },
  BILLING_TABLE: {
    link: "/billing", //:billName,
    name: "Billing Table",
    Roles: [Roles.BILLER],
  },
  ANALYTICS: {
    link: "/analytics",
    name: "Analytics",
    Roles: [Roles.ADMIN, Roles.BRANCHADMIN],
  },
});

export const AnalyticsTypes = [
  {
    title: "Sales Summary",
    description: "Revenue, bills, and average value at a glance.",
  },
  {
    title: "Item Breakdown",
    description: "Best & worst selling products with revenue stats.",
  },
  {
    title: "Stock Insights",
    description: "Track low, fast-moving, and stagnant inventory.",
  },
];

export const Cloudinary = Object.freeze({
  UPLOAD_PRESET: "Smart_Billing_System",
  CLOUD_NAME: "dlqcpq76e",
});

export const AppNameAcronym = "SBS";
export const AppNameFull = "Smart Billing System";
