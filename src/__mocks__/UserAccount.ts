/* ----------------------------------------------------------------
purpose: `useUserAccount()` Mock up
usage: 

The default account (null) and roles (none) are applied when used like this: 

  jest.mock("../../../utils/auth")

To use dynamicaly (i.e. with different account / roles in each test), use like this: 

    jest.mock('../UserAccount', () => ({ useUserAccount: mockUseUserAccount }))

*/
import { AccountInfo } from "@azure/msal-browser"

export const nullAccount: AccountInfo = {
    homeAccountId: "",
    tenantId: "",
    username: "",
    environment: "",
    localAccountId: "",
}

let __roles__: string[] | undefined = []
let __account__: AccountInfo | null = nullAccount

export function __set_roles(roles?: string[] | undefined) {
    __roles__ = roles
}

export function __set_account(account: AccountInfo | null) {
    __account__ = account
}

export function mockUseUserAccount() {
    return {
        account: __account__,
        roles: __roles__,
    }
}
