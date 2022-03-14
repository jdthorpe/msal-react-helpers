import React from 'react';
import { useUserAccount } from './UserAccount';

interface IPrivateComponentProps {
  unauthenticated: string | React.FunctionComponent<any> | React.ComponentClass<any, any>
  loading: string | React.FunctionComponent<any> | React.ComponentClass<any, any>
  content?: string | React.FunctionComponent<any> | React.ComponentClass<any, any>
}

export const PrivateComponent: React.FC<IPrivateComponentProps> = ({ unauthenticated, loading, children, content }) => {
  const { account, loading: loadingStatus } = useUserAccount()

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

  // Authenticated 
  return content ? React.createElement(content) : React.createElement(React.Fragment, { children })
}