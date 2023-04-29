import { Manage } from "src/models/manage.model";
export interface ManageState
{
    manages: Manage[];
    manage?: Manage;
    isLoading: boolean;
    error: string;
}