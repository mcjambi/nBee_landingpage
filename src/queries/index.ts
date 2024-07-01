import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default queryClient;



/**
 * Model for redux actions with pagination
 */

export type IQueryParams = {
    query?: string;
    page?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    [propName: string]: any;
};
