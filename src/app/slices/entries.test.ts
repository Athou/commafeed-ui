/* eslint-disable import/first */
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended"

vi.doMock("app/client", () => ({ client: mockDeep() }))

import { client } from "app/client"
import { buildStore } from "app/store"
import { Entries, Entry } from "app/types"
import { AxiosResponse } from "axios"
import { loadEntries } from "./entries"

describe("entries", () => {
    let store = buildStore()
    const mockClient = client as DeepMockProxy<typeof client>

    beforeEach(() => {
        store = buildStore()
        mockReset(mockClient)
    })

    it("loads entries", async () => {
        const response: Entries = {
            entries: [{ id: "3" } as Entry],
            hasMore: false,
            name: "my-feed",
            errorCount: 3,
            feedLink: "https://mysite.com/feed",
            timestamp: 123,
            ignoredReadStatus: false,
        }

        mockClient.feed.getEntries.mockResolvedValue({
            data: response,
        } as AxiosResponse<Entries>)

        const promise = store.dispatch(
            loadEntries({
                sourceType: "feed",
                req: {
                    id: "feed-id",
                },
            })
        )

        expect(store.getState().entries.source.type).toBe("feed")
        expect(store.getState().entries.source.id).toBe("feed-id")
        expect(store.getState().entries.entries).toStrictEqual([])
        expect(store.getState().entries.hasMore).toBe(true)
        expect(store.getState().entries.sourceLabel).toBe("")
        expect(store.getState().entries.sourceWebsiteUrl).toBe("")
        expect(store.getState().entries.timestamp).toBeUndefined()

        await promise
        expect(store.getState().entries.source.type).toBe("feed")
        expect(store.getState().entries.source.id).toBe("feed-id")
        expect(store.getState().entries.entries).toStrictEqual(response.entries)
        expect(store.getState().entries.hasMore).toBe(response.hasMore)
        expect(store.getState().entries.sourceLabel).toBe(response.name)
        expect(store.getState().entries.sourceWebsiteUrl).toBe(response.feedLink)
        expect(store.getState().entries.timestamp).toBe(response.timestamp)
    })
})
