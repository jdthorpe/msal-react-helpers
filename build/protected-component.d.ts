import React from 'react';
declare type RequiredRolesProps = {
    allowedRoles: string[];
    requiredRole?: never;
    requiredRoles?: never;
} | {
    allowedRoles?: never;
    requiredRole: string;
    requiredRoles?: never;
} | {
    allowedRoles?: never;
    requiredRole?: never;
    requiredRoles: string[];
};
interface IRequireAuthenticationProps {
    unauthorized: string | React.FunctionComponent<any> | React.ComponentClass<any, any>;
    unauthenticated: string | React.FunctionComponent<any> | React.ComponentClass<any, any>;
    loading: string | React.FunctionComponent<any> | React.ComponentClass<any, any>;
    content?: string | React.FunctionComponent<any> | React.ComponentClass<any, any>;
}
export declare const RBACProtectedComponent: React.FC<RequiredRolesProps & IRequireAuthenticationProps>;
export {};
