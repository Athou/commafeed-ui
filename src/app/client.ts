import axios from "axios"
import {
    Category,
    CollapseRequest,
    Entries,
    FeedInfo,
    FeedInfoRequest,
    GetEntriesPaginatedRequest,
    LoginRequest,
    MarkRequest,
    RegistrationRequest,
    Settings,
    SubscribeRequest,
    UserModel,
} from "./types"

const axiosInstance = axios.create({ baseURL: "./rest", withCredentials: true })
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) window.location.hash = "/login"
        throw error
    }
)

export const client = {
    category: {
        getRoot: () => axiosInstance.get<Category>("category/get"),
        collapse: (req: CollapseRequest) => axiosInstance.post("category/collapse", req),
        getEntries: (req: GetEntriesPaginatedRequest) => axiosInstance.get<Entries>("category/entries", { params: req }),
        markEntries: (req: MarkRequest) => axiosInstance.post("category/mark", req),
    },
    entry: {
        mark: (req: MarkRequest) => axiosInstance.post("entry/mark", req),
    },
    feed: {
        getEntries: (req: GetEntriesPaginatedRequest) => axiosInstance.get<Entries>("feed/entries", { params: req }),
        markEntries: (req: MarkRequest) => axiosInstance.post("feed/mark", req),
        fetchFeed: (req: FeedInfoRequest) => axiosInstance.post<FeedInfo>("feed/fetch", req),
        subscribe: (req: SubscribeRequest) => axiosInstance.post("feed/subscribe", req),
    },
    user: {
        login: (req: LoginRequest) => axiosInstance.post("user/login", req),
        register: (req: RegistrationRequest) => axiosInstance.post("user/register", req),
        getSettings: () => axiosInstance.get<Settings>("user/settings"),
        saveSettings: (settings: Settings) => axiosInstance.post("user/settings", settings),
        getProfile: () => axiosInstance.get<UserModel>("user/profile"),
    },
}

/**
 * transform an error object to an array of strings that can be displayed to the user
 * @param err an error object (e.g. from axios)
 * @returns an array of messages to show the user
 */
export const errorToStrings = (err: any) => {
    let strings: string[] = []

    if (axios.isAxiosError(err)) {
        if (err.response) {
            const data = err.response.data as any
            if (typeof data === "string") strings.push(data)
            else if (typeof data === "object" && data.errors) strings = [...strings, ...data.errors]
        }
    }

    return strings
}
