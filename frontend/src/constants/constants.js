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
  ADDGOODS: "/api/goods/addGoods",
  GETUSERSBYBRANCHID: "/api/auth/getUsersByBranchId",
  DELETEUSERBYID: "/api/auth/deleteUserById",
  CREATEUSER: "/api/auth/createUser",
  UPDATEUSER: "/api/auth/updateUser",
});

export const HomepageNavigations = Object.freeze([
  {
    name: "Login",
    link: "/login",
  },
  {
    name: "Register",
    link: "/signup",
  },
]);

export const AppNameAcronym = "SBS";
export const AppNameFull = "Smart Billing System";
