import React from "react";
declare type Component = string | React.FunctionComponent<any> | React.ComponentClass<any, any>;
interface IForceAuthenticationProps {
    forcingLoginMessage: Component;
    unauthenticated: Component;
    loading: Component;
    content?: Component;
}
export declare const ForceAuthenticationOnce: React.FC<IForceAuthenticationProps>;
export declare function useForceLoginOnce(): boolean;
export {};
