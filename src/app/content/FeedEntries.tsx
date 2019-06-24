import { Container } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useSelector } from "react-redux";
import { Entry } from "../../api/commafeed-api";
import { useAppDispatch } from "../App";
import { ActionCreator, EntrySource, State } from "../AppReducer";
import { FeedEntry } from "./FeedEntry";

export const FeedEntries: React.FC<{
  id: string;
  source: EntrySource;
}> = props => {
  const entries = useSelector((state: State) => state.entries.entries);
  const hasMore = useSelector((state: State) => state.entries.hasMore);
  const selectedEntryId = useSelector(
    (state: State) => state.entries.selectedEntryId
  );
  const selectedEntryExpanded = useSelector(
    (state: State) => state.entries.selectedEntryExpanded
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(ActionCreator.entries.setSource(props.id, props.source));
    window.scrollTo(0, 0);
  }, [dispatch, props.id, props.source]);

  useEffect(() => {
    const keyPressed = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (e.shiftKey) dispatch(ActionCreator.entries.selectPreviousEntry());
        else dispatch(ActionCreator.entries.selectNextEntry());
      }
    };

    window.addEventListener("keydown", keyPressed);
    return () => window.removeEventListener("keydown", keyPressed);
  }, [dispatch]);

  const loadMoreEntries = (page: number) => {
    dispatch(ActionCreator.entries.loadMore());
  };

  const entryHeaderClicked = useCallback(
    (entry: Entry) => {
      dispatch(ActionCreator.entries.selectEntry(entry));
    },
    [dispatch]
  );

  const entryExternalLinkClicked = useCallback(
    (entry: Entry) => {
      if (!entry.read)
        dispatch(
          ActionCreator.entries.markAsRead(entry.id, +entry.feedId, true)
        );
    },
    [dispatch]
  );

  const entryReadStatusCheckboxClicked = useCallback(
    (entry: Entry) => {
      dispatch(
        ActionCreator.entries.markAsRead(entry.id, +entry.feedId, !entry.read)
      );
    },
    [dispatch]
  );

  if (!entries) return null;
  return (
    <Container>
      <InfiniteScroll
        initialLoad={false}
        loadMore={page => loadMoreEntries(page)}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        {entries.map(e => (
          <FeedEntry
            entry={e}
            expanded={
              e.id === selectedEntryId && selectedEntryExpanded === true
            }
            onHeaderClick={entryHeaderClicked}
            onExternalLinkClick={entryExternalLinkClicked}
            onReadStatusCheckboxClick={entryReadStatusCheckboxClicked}
            key={e.id}
          />
        ))}
      </InfiniteScroll>
    </Container>
  );
};
