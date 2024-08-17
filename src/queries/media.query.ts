import { TypedUser } from "./user.query";

type TypedThumbnail = {
    '512x512': string,
    '300x200': string,
    '256x169': string,
    '128x128': string,
    [propKey: string]: string
}
export interface TypedMedia {
    media_id?: string;
    media_url?: string;
    media_filename?: string;
    media_description?: string;
    media_filetype?: string;
    media_filesize?: number;
    media_extention?: string;
    media_thumbnail?: TypedThumbnail;
    private_access?: number;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    user?: TypedUser
}
