import React, { useEffect, useRef, useState } from "react";
import { useMsal, useIsAuthenticated, useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { PrivateComponent } from "./private-component";

type Component =
  | string
  | React.FunctionComponent<any>
  | React.ComponentClass<any, any>;

interface IForceAuthenticationProps {
  forcingLoginMessage: Component
  unauthenticated: Component
  loading: Component
  content?: Component
}

export const ForceAuthenticationOnce: React.FC<IForceAuthenticationProps> = ({
  forcingLoginMessage,
  unauthenticated,
  loading,
  content,
  children,
}) => {
  const forced_login = useForceLoginOnce();

  return React.createElement(
    PrivateComponent,
    {
      unauthenticated: forced_login ? forcingLoginMessage : unauthenticated,
      loading,
      content,
    },
    children
  );
};


// TODO: inspect the progress during page load 

export function useForceLoginOnce(): boolean {
  const firstLoadRef = useRef(true);

  const { login } = useMsalAuthentication(InteractionType.Redirect);
  const [forced_log_in, set_forced_log_in] = useState(false);

  // keep MGT and msal-react in sync
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  useEffect(() => {
    if (isAuthenticated || ["login", "logout", "acquireToken", "ssoSilent", "handleRedirect",].includes(inProgress))
      set_forced_log_in(false);
  }, [firstLoadRef, isAuthenticated, inProgress]);

  useEffect(() => {
    if (inProgress === "startup") return;
    if (!firstLoadRef.current
      || isAuthenticated
      || ["login", "logout", "acquireToken", "ssoSilent", "handleRedirect",].includes(inProgress)) return;
    firstLoadRef.current = false;
    login();
    set_forced_log_in(true);
  }, [firstLoadRef, isAuthenticated, inProgress, login]);

  return forced_log_in;
}
