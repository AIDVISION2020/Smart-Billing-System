export const APIEndpoints = Object.freeze({
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  LOGOUT: "/api/auth/logout",
  GETGOODSBYCATEGORIES: "/api/goods/getGoods",
  GETBRANCHES: "/api/branch/getBranches",
  GETACCESSIBLEBRANCHES: "/api/branch/getAccessibleBranches",
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
