import { Info } from "src/models/info.model";

export interface InfoState {
    info: Info;
    fetched: boolean;
    error: string;
}