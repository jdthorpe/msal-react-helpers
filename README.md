# MSAL-React Helpers

This library contains some common patterns including:

- **Private Components** which are only displayed to users who are logged in

- **Protected Components** which are only displayed to users who have been
assigned the correct roles (RBAC)

- **Force Login Once** so that users are automatically prompted to login when
a page / component is displayed for the first time and aren't already logged
in.

- **Connect MSAL-Browser with MGT Components** so that you can take advantage
of the awesome Microsoft Graph Toolkit for React Components, and use
msal-browser to manage your own components.

## General Setup

I like to start by instantiating an MSAL Public Client Application in a `msal-config.ts` file, like so:

```tsx
// auth-config.ts
import { Configuration, PublicClientApplication } from "@azure/msal-browser";
import { Providers as MGT_Providers } from "@microsoft/mgt-element/dist/es6";
import { Msal2Provider as MGT_Msal2Provider } from "@microsoft/mgt-msal2-provider/dist/es6";

const configuration: Configuration = {
  auth: {
    // provide clientId and authority in the build environment or a .env file
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: process.env.REACT_APP_AUTHORITY,
    redirectUri: window.location.origin,
  },
};

export const MSAL_instance = new PublicClientApplication(configuration);
MGT_Providers.globalProvider = new MGT_Msal2Provider({
  publicClientApplication: MSAL_instance,
});
```

and then wrap the application with the `MsalProvider` in the usual way:

```tsx
// index.tsx
import { App } from './/app';
import { MSAL_instance } from "./auth/configuration"
import { MsalProvider } from "@azure/msal-react";

ReactDOM.render(
  <MsalProvider instance={MSAL_instance}>
    <App />
  </MsalProvider>,
  document.getElementById('root')
);
```

## Setup with Microsoft Graph Toolkit

Connecting the MSAL provider with [Microsoft Graph Tookit for
React](https://www.npmjs.com/package/@microsoft/mgt-react) is as easy as:

```tsx
// app.tsx
import { useConnectMGT } from 'react-msal-helpers';

export const App = () => {
  useConnectMGT()

  ... your application 
};
```

Note that `useConnectMGT()` must be called in a component wrapped in `<MsalProvider>`.

## Private Components

To require that a user be logged in to view a component, use:

```tsx
import { PrivateComponent } from 'react-msal-helpers';

<PrivateComponent
    /* This component is rendered when the user is not logged in */
    unauthenticated={UnauthenticatedComponent}
    /* This component is rendered when the MSAL Provider status is "startup" */
    loading={LoadingComponent}
    /* The protected component */
    content={ProtectedComponent}
/>
```

## Protected Components

To require that a user be logged in and have the appropriate [Application
Registration
Permissions](https://docs.microsoft.com/en-us/azure/active-directory/roles/custom-available-permissions)
(RBAC), use:

```tsx
import { RBACProtectedComponent } from 'react-msal-helpers';

<RBACProtectedComponent
    /* This component is rendered when if the user is logged 
       in but does not have the correct App Registration Roles */
    unauthorized={UnauthorizedComponent}
    /* This component is rendered when the user is not logged in */
    unauthenticated={UnauthenticatedComponent}
    /* This component is rendered when the MSAL Provider status is "startup" */
    loading={LoadingComponent}
    /* The protected componenet is visible if the user has been granted **This** role */
    requiredRole="some_role"
    /* The protected componenet is visible if the user has been granted **All of** these roles */
    requiredRoles={["some_role","some_other_role"]}
    /* The protected componenet is visible if the user has been granted **Any of** these roles */
    allowedRoles={["some_role","some_other_role"]}
    /* The protected component */
    content={ProtectedComponent}
/>
```

## Private / Protected Routing

Private and Protected routing is accomplished by passing the appropriate
redirect component for your favorite React Routing library. For example, this
can be accomplished with
[react-router-dom](https://www.npmjs.com/package/react-router-dom) using:

```tsx
import { PrivateComponent, RBACProtectedComponent  } from 'react-msal-helpers';
import { Switch, Route, Redirect } from 'react-router-dom';
 
const MyPrivateRoute = props => (
  <PrivateComponent 
    loading={"loading accounts data..."}
    unauthenticated={() => <Redirect to="/pleaseLogIn" />}
    content={() => <p>Private Content</p>}
    />
)

const MyProtectedRoute = props => (
  <RBACProtectedComponent 
    requiredRole="something"
    loading={"loading accounts data..."}
    unauthorized={() => <Redirect to="/unauthorized" />}
    unauthenticated={() => <Redirect to="/pleaseLogIn" />}
    content={() => <p>Protected Content</p>}
    />
)

const MyAppRouter= props => (
  <Switch>
    <Route exact path='/private' render={MyPrivateRoute} />
    <Route exact path='/protected' render={MyProtectedRoute} />
    <Route exact path='/unauthorized' render="UNAUTHORIZED" />
    <Route exact path='/pleaseLogIn' render={() => <p>Please log in</p>} />
  </Switch>
)
```

## Force Login on the first render

If logging in is required to view an application or component, you can save
the user a click and a few moments by automatically starting the login
process. This can be accomplished using a hook like so:

```tsx
import { useForceLoginOnce } from 'react-msal-helpers';

const App = props => {
    useForceLoginOnce()
    ...
}
```

or with a compnent wrapper like so:

```tsx
import { ForceAuthenticationOnce } from 'react-msal-helpers';

<ForceAuthenticationOnce
  /* This component is rendered when the login is being initialized automatically */
  forcingLoginMessage={() => <p>Logging you in</p>}
  /* Content to render when the user is not logged in and authentication is not being forced */
  unauthenticated={() => <p>Please log in</p>}
  /* Rendered when the MsalAppliation state is "startup" */
  loading={() => <p>Loading account data</p>}
  /* The content to render  */
  content={App}
  />
```

Note that `useForceLoginOnce()` and `<ForceAuthenticationOnce/>` must be used
in a component wrapped in `<MsalProvider>`.

## Notes

- [MSAL supports multiple simultaneous accounts](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/FAQ.md#in-what-scenarios-will-getallaccounts-return-multiple-accounts)
These pickers use the "active account" for auth/auth.
