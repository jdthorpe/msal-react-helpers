import { useState, useEffect } from "react"
import { useMsal, useIsAuthenticated } from "@azure/msal-react"
import { AccountInfo } from "@azure/msal-browser"

export interface IUserAccountInfo {
    account: AccountInfo | null
    roles?: string[]
}

export function useUserAccount(): IUserAccountInfo & { loading: boolean } {
    const [account_info, set_account_info] = useState<IUserAccountInfo>({
        account: null,
    })
    const { instance: MSALinstance, inProgress } = useMsal()
    const isAuthenticated = useIsAuthenticated()

    useEffect(() => {
        const account = MSALinstance.getActiveAccount()
        const claims: { roles?: string[] } = account?.idTokenClaims as
            | any
            | undefined
        set_account_info({ account, roles: claims?.roles })
    }, [isAuthenticated, MSALinstance])

    return { ...account_info, loading: inProgress !== "none" }
}
