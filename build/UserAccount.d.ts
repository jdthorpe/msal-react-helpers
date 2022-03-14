import { AccountInfo } from "@azure/msal-browser";
export interface IUserAccountInfo {
    account: AccountInfo | null;
    roles?: string[];
}
export declare function useUserAccount(): IUserAccountInfo & {
    loading: boolean;
};
