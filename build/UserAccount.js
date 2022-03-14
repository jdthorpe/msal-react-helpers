"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserAccount = void 0;
const react_1 = require("react");
const msal_react_1 = require("@azure/msal-react");
function useUserAccount() {
    const [account_info, set_account_info] = (0, react_1.useState)({
        account: null,
    });
    const { instance: MSALinstance, inProgress } = (0, msal_react_1.useMsal)();
    const isAuthenticated = (0, msal_react_1.useIsAuthenticated)();
    (0, react_1.useEffect)(() => {
        const account = MSALinstance.getActiveAccount();
        const claims = account === null || account === void 0 ? void 0 : account.idTokenClaims;
        set_account_info({ account, roles: claims === null || claims === void 0 ? void 0 : claims.roles });
    }, [isAuthenticated, MSALinstance]);
    return Object.assign(Object.assign({}, account_info), { loading: inProgress !== "none" });
}
exports.useUserAccount = useUserAccount;
