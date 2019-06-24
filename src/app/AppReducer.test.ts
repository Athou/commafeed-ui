import deepFreeze from "deep-freeze";
import {
  Category,
  Entry,
  ISettings,
  ReadingMode,
  ReadingOrder,
  Subscription
} from "../api/commafeed-api";
import { Routes } from "../Routes";
import { AppReducer, EntrySource, State } from "./AppReducer";

// https://stackoverflow.com/a/45228624/1885506
jest.mock("../index.tsx", () => "root");

const initialState: State = deepFreeze({
  tree: {
    root: new Category({
      id: "all",
      name: "All",
      children: [
        new Category({
          id: "1000",
          name: "Category1",
          children: [],
          feeds: [
            new Subscription({
              id: 1002,
              name: "Feed1",
              message: "content hash not modified",
              errorCount: 0,
              lastRefresh: 1558992570834,
              nextRefresh: 1558992870708,
              feedUrl: "https://www.feed1.com/feed.xml",
              feedLink: "https://www.feed1.com/",
              iconUrl: "http://localhost:8082/rest/feed/favicon/1002",
              unread: 156,
              categoryId: "1000",
              position: 0,
              newestItemTime: 1558977120000
            }),
            new Subscription({
              id: 2001,
              name: "Feed2",
              message: "",
              errorCount: 0,
              lastRefresh: 1558992556385,
              nextRefresh: 1558992855697,
              feedUrl: "https://www.feed2.com/feed",
              feedLink: "https://www.feed2.com",
              iconUrl: "http://localhost:8082/rest/feed/favicon/2001",
              unread: 0,
              categoryId: "1000",
              position: 0
            })
          ],
          expanded: false,
          position: 0
        })
      ],
      feeds: [],
      expanded: true,
      position: 0
    })
  },
  entries: {
    entries: [
      new Entry({
        id: "29002",
        guid: "guid1",
        title: "self-image",
        content: "entry1 content",
        categories: "cat",
        rtl: false,
        date: 1558903413000,
        insertedDate: 1558975440008,
        feedId: "5002",
        feedName: "feed1",
        feedUrl: "https://feed1.com/rss",
        feedLink: "https://feed1.com/",
        iconUrl: "http://localhost:8082/rest/feed/favicon/5002",
        url: "https://feed1.com/post/1",
        read: false,
        starred: false,
        markable: true,
        tags: []
      })
    ],
    loading: false
  },
  settings: {},
  redirect: {}
}) as State;
const reducer = AppReducer;

describe("Tree reducer", () => {
  it("changes category root", () => {
    const root = { id: "test" } as Category;
    const state = reducer(initialState, { type: "tree.setRoot", root });
    expect(state.tree.root).toBe(root);
  });
  it("changes category expanded status", () => {
    expect(initialState.tree.root!.children[0].expanded).toBe(false);
    const state = reducer(initialState, {
      type: "tree.setCategoryExpanded",
      categoryId: 1000,
      expanded: true
    });
    expect(state.tree.root!.children[0].expanded).toBe(true);
  });
  it("decrements feed unread count", () => {
    const unread = initialState.tree.root!.children[0].feeds[0].unread;
    const state = reducer(initialState, {
      type: "entries.setRead",
      id: "29002",
      feedId: 1002,
      read: true
    });
    expect(state.tree.root!.children[0].feeds[0].unread).toBe(unread - 1);
  });
});

describe("Entries reducer", () => {
  it("changes source", () => {
    const id = "12";
    const source: EntrySource = "category";

    expect(initialState.entries.id).not.toBe(id);
    expect(initialState.entries.source).not.toBe(source);
    const state = reducer(initialState, {
      type: "entries.setSource",
      id,
      source
    });
    expect(state.entries.id).toBe(id);
    expect(state.entries.source).toBe(source);
  });
  it("changes entries", () => {
    const entries: Entry[] = [];
    const hasMore = true;
    const label = "feed1";

    expect(initialState.entries.entries).not.toBe(entries);
    expect(initialState.entries.hasMore).not.toBe(hasMore);
    expect(initialState.entries.label).not.toBe(label);
    const state = reducer(initialState, {
      type: "entries.setEntries",
      entries,
      hasMore,
      label
    });
    expect(state.entries.entries).toBe(entries);
    expect(state.entries.hasMore).toBe(hasMore);
    expect(state.entries.label).toBe(label);
  });
  it("add entries", () => {
    const entries: Entry[] = [{ id: "29003" } as Entry];
    const hasMore = true;

    expect(initialState.entries.entries!.length).toBe(1);
    expect(initialState.entries.hasMore).not.toBe(hasMore);
    const state = reducer(initialState, {
      type: "entries.addEntries",
      entries,
      hasMore
    });
    expect(state.entries.entries!.length).toBe(2);
    expect(state.entries.hasMore).toBe(hasMore);
  });
  it("does not add already existing entries", () => {
    const entries: Entry[] = [
      { id: "29002" } as Entry,
      { id: "29003" } as Entry
    ];
    const hasMore = true;

    expect(initialState.entries.entries!.length).toBe(1);
    expect(initialState.entries.hasMore).not.toBe(hasMore);
    const state = reducer(initialState, {
      type: "entries.addEntries",
      entries,
      hasMore
    });
    expect(state.entries.entries!.length).toBe(2);
    expect(state.entries.hasMore).toBe(hasMore);
  });
  it("selects entry", () => {
    const id = "123";

    expect(initialState.entries.selectedEntryId).not.toBe(id);
    const state = reducer(initialState, {
      type: "entries.setSelectedEntryId",
      id
    });
    expect(state.entries.selectedEntryId).toBe(id);
  });
  it("expands selected entry", () => {
    const expanded = true;

    expect(initialState.entries.selectedEntryExpanded).not.toBe(expanded);
    const state = reducer(initialState, {
      type: "entries.setSelectedEntryExpanded",
      expanded
    });
    expect(state.entries.selectedEntryExpanded).toBe(expanded);
  });
  it("marks as read", () => {
    const read = true;

    expect(initialState.entries.entries![0].read).not.toBe(read);
    const state = reducer(initialState, {
      type: "entries.setRead",
      id: "29002",
      feedId: 0,
      read
    });
    expect(state.entries.entries![0].read).toBe(read);
  });

  it("sets loading status", () => {
    const loading = true;

    expect(initialState.entries.loading).not.toBe(loading);
    const state = reducer(initialState, {
      type: "entries.setLoading",
      loading
    });
    expect(state.entries.loading).toBe(loading);
  });
});

describe("Settings reducer", () => {
  it("changes", () => {
    const settings = { language: "en" } as ISettings;
    const state = reducer(initialState, { type: "settings.set", settings });
    expect(state.settings).toBe(settings);
  });
  it("changes reading mode", () => {
    const readingMode = ReadingMode.Unread;

    expect(initialState.settings!.readingMode).not.toBe(readingMode);
    const state = reducer(initialState, {
      type: "settings.setReadingMode",
      readingMode
    });
    expect(state.settings!.readingMode).toBe(readingMode);
  });
  it("changes reading order", () => {
    const readingOrder = ReadingOrder.Desc;

    expect(initialState.settings!.readingOrder).not.toBe(readingOrder);
    const state = reducer(initialState, {
      type: "settings.setReadingOrder",
      readingOrder
    });
    expect(state.settings!.readingOrder).toBe(readingOrder);
  });
});

describe("Redirect reducer", () => {
  it("redirects to subscribe", () => {
    expect(initialState.redirect.redirectTo).toBeUndefined();
    const state = reducer(initialState, { type: "navigateToSubscribe" });
    expect(state.redirect.redirectTo).toBe(Routes.app.subscribe.create({}));
  });
  it("redirects to root category", () => {
    expect(initialState.redirect.redirectTo).toBeUndefined();
    const state = reducer(initialState, { type: "navigateToRootCategory" });
    expect(state.redirect.redirectTo).toBe(Routes.app.root.create({}));
  });
  it("redirects to category", () => {
    expect(initialState.redirect.redirectTo).toBeUndefined();
    const state = reducer(initialState, {
      type: "navigateToCategory",
      categoryId: "12"
    });
    expect(state.redirect.redirectTo).toBe(
      Routes.app.category.create({ categoryId: "12" })
    );
  });
  it("redirects to feed", () => {
    expect(initialState.redirect.redirectTo).toBeUndefined();
    const state = reducer(initialState, { type: "navigateToFeed", feedId: 12 });
    expect(state.redirect.redirectTo).toBe(
      Routes.app.feed.create({ feedId: "12" })
    );
  });
});
