"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useForceLoginOnce = exports.ForceAuthenticationOnce = void 0;
const react_1 = __importStar(require("react"));
const msal_react_1 = require("@azure/msal-react");
const msal_browser_1 = require("@azure/msal-browser");
const private_component_1 = require("./private-component");
const ForceAuthenticationOnce = ({ forcingLoginMessage, unauthenticated, loading, content, children, }) => {
    const forced_login = useForceLoginOnce();
    return react_1.default.createElement(private_component_1.PrivateComponent, {
        unauthenticated: forced_login ? forcingLoginMessage : unauthenticated,
        loading,
        content,
    }, children);
};
exports.ForceAuthenticationOnce = ForceAuthenticationOnce;
// TODO: inspect the progress during page load 
function useForceLoginOnce() {
    const firstLoadRef = (0, react_1.useRef)(true);
    const { login } = (0, msal_react_1.useMsalAuthentication)(msal_browser_1.InteractionType.Redirect);
    const [forced_log_in, set_forced_log_in] = (0, react_1.useState)(false);
    // keep MGT and msal-react in sync
    const isAuthenticated = (0, msal_react_1.useIsAuthenticated)();
    const { inProgress } = (0, msal_react_1.useMsal)();
    (0, react_1.useEffect)(() => {
        if (isAuthenticated || ["login", "logout", "acquireToken", "ssoSilent", "handleRedirect",].includes(inProgress))
            set_forced_log_in(false);
    }, [firstLoadRef, isAuthenticated, inProgress]);
    (0, react_1.useEffect)(() => {
        if (inProgress === "startup")
            return;
        if (!firstLoadRef.current
            || isAuthenticated
            || ["login", "logout", "acquireToken", "ssoSilent", "handleRedirect",].includes(inProgress))
            return;
        firstLoadRef.current = false;
        login();
        set_forced_log_in(true);
    }, [firstLoadRef, isAuthenticated, inProgress, login]);
    return forced_log_in;
}
exports.useForceLoginOnce = useForceLoginOnce;
