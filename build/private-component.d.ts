import React from 'react';
interface IPrivateComponentProps {
    unauthenticated: string | React.FunctionComponent<any> | React.ComponentClass<any, any>;
    loading: string | React.FunctionComponent<any> | React.ComponentClass<any, any>;
    content?: string | React.FunctionComponent<any> | React.ComponentClass<any, any>;
}
export declare const PrivateComponent: React.FC<IPrivateComponentProps>;
export {};
