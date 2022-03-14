import React from 'react';
import { useUserAccount } from './UserAccount';

type RequiredRolesProps =
  | { allowedRoles: string[]; requiredRole?: never; requiredRoles?: never }
  | { allowedRoles?: never; requiredRole: string; requiredRoles?: never }
  | { allowedRoles?: never; requiredRole?: never; requiredRoles: string[] }

interface IRequireAuthenticationProps {
  unauthorized: string | React.FunctionComponent<any> | React.ComponentClass<any, any>
  unauthenticated: string | React.FunctionComponent<any> | React.ComponentClass<any, any>
  loading: string | React.FunctionComponent<any> | React.ComponentClass<any, any>
  content?: string | React.FunctionComponent<any> | React.ComponentClass<any, any>
}

export const RBACProtectedComponent: React.FC<RequiredRolesProps & IRequireAuthenticationProps> = ({ requiredRole, allowedRoles, requiredRoles, unauthorized, unauthenticated, loading, children, content }) => {
  const { account, roles, loading: loadingStatus } = useUserAccount()

  if (children) {
    if (content) { throw new Error("content and children passed to protected-component") }
    else { console.warn("Children passed to RequireRole component. Please use the 'content' parameter instead") }
  }

  if (!account) {
    if (loadingStatus) {
      return React.createElement(loading)
    }
    return React.createElement(unauthenticated)
  }

  if (!roles
    || (requiredRoles && !requiredRoles.every(role => roles.indexOf(role) !== -1))
    || (allowedRoles && allowedRoles.every(role => roles.indexOf(role) === -1))
    || (requiredRole && (roles.indexOf(requiredRole) === -1))
  ) {
    return React.createElement(unauthorized)
  }

  // Authenticated and Authorized
  return content ? React.createElement(content) : React.createElement(React.Fragment, { children })
}