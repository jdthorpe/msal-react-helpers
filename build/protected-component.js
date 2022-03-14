"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RBACProtectedComponent = void 0;
const react_1 = __importDefault(require("react"));
const UserAccount_1 = require("./UserAccount");
const RBACProtectedComponent = ({ requiredRole, allowedRoles, requiredRoles, unauthorized, unauthenticated, loading, children, content }) => {
    const { account, roles, loading: loadingStatus } = (0, UserAccount_1.useUserAccount)();
    if (children) {
        if (content) {
            throw new Error("content and children passed to protected-component");
        }
        else {
            console.warn("Children passed to RequireRole component. Please use the 'content' parameter instead");
        }
    }
    if (!account) {
        if (loadingStatus) {
            return react_1.default.createElement(loading);
        }
        return react_1.default.createElement(unauthenticated);
    }
    if (!roles
        || (requiredRoles && !requiredRoles.every(role => roles.indexOf(role) !== -1))
        || (allowedRoles && allowedRoles.every(role => roles.indexOf(role) === -1))
        || (requiredRole && (roles.indexOf(requiredRole) === -1))) {
        return react_1.default.createElement(unauthorized);
    }
    // Authenticated and Authorized
    return content ? react_1.default.createElement(content) : react_1.default.createElement(react_1.default.Fragment, { children });
};
exports.RBACProtectedComponent = RBACProtectedComponent;
