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
  },
  MANAGE_GOODS: {
    link: "/manage-goods",
    name: "Manage Goods",
  },
  BILLING: {
    link: "/billing",
    name: "Billing",
  },
  BILLING_TABLE: {
    link: "/billing", //:billName,
    name: "Billing Table",
  },
});

export const Cloudinary = Object.freeze({
  UPLOAD_PRESET: "Smart_Billing_System",
  CLOUD_NAME: "dlqcpq76e",
});

export const AppNameAcronym = "SBS";
export const AppNameFull = "Smart Billing System";
