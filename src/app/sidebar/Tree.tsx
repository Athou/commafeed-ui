import { makeStyles } from "@material-ui/core";
import { ChevronRight, ExpandMore, Inbox } from "@material-ui/icons";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Category, Subscription } from "../../api/commafeed-api";
import { categoryUnreadCount } from "../../api/utils";
import { useAppDispatch } from "../App";
import { AppConstants } from "../AppConstants";
import { ActionCreator, State } from "../AppReducer";
import { TreeNode } from "./TreeNode";

const useStyles = makeStyles({
  root: {
    marginTop: "10px",
    marginRight: "5px",
    marginLeft: "5px"
  }
});

const allIcon = <Inbox />;
const expandedIcon = <ExpandMore />;
const collapsedIcon = <ChevronRight />;

export const Tree: React.FC = () => {
  const id = useSelector((state: State) => state.entries.id);
  const source = useSelector((state: State) => state.entries.source);
  const root = useSelector((state: State) => state.tree.root);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  // load initial tree and refresh periodically
  useEffect(() => {
    dispatch(ActionCreator.tree.reload());

    const id = setInterval(
      () => dispatch(ActionCreator.tree.reload()),
      AppConstants.TREE_RELOAD_INTERVAL
    );
    return () => clearInterval(id);
  }, [dispatch]);

  const categoryClicked = useCallback(
    (id: string) => {
      dispatch(ActionCreator.redirect.navigateToCategory(id));
    },
    [dispatch]
  );

  const categoryIconClicked = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      dispatch(ActionCreator.tree.toggleCategoryExpanded(+id));
    },
    [dispatch]
  );

  const feedClicked = useCallback(
    (id: string) => {
      dispatch(ActionCreator.redirect.navigateToFeed(+id));
    },
    [dispatch]
  );

  const allCategoryNode = () => (
    <TreeNode
      id={AppConstants.ALL_CATEGORY_ID}
      name="All"
      icon={allIcon}
      unread={categoryUnreadCount(root)}
      selected={source === "category" && AppConstants.ALL_CATEGORY_ID === id}
      expanded={false}
      level={0}
      onClick={categoryClicked}
    />
  );

  const categoryNode = (category: Category, level: number = 0) => {
    return (
      <TreeNode
        id={category.id}
        name={category.name}
        icon={category.expanded ? expandedIcon : collapsedIcon}
        unread={categoryUnreadCount(category)}
        selected={source === "category" && category.id === id}
        expanded={category.expanded}
        level={level}
        onClick={categoryClicked}
        onIconClick={categoryIconClicked}
        key={category.id}
      />
    );
  };

  const feedNode = (feed: Subscription, level: number = 0) => {
    return (
      <TreeNode
        id={String(feed.id)}
        name={feed.name}
        icon={feed.iconUrl}
        unread={feed.unread}
        selected={source === "feed" && String(feed.id) === id}
        level={level}
        onClick={feedClicked}
        key={feed.id}
      />
    );
  };

  const recursiveCategoryNode = (category: Category, level: number = 0) => {
    return (
      <React.Fragment key={"recursiveCategoryNode-" + category.id}>
        {categoryNode(category, level)}
        {category.expanded &&
          category.children.map(c => recursiveCategoryNode(c, level + 1))}
        {category.expanded && category.feeds.map(f => feedNode(f, level + 1))}
      </React.Fragment>
    );
  };

  if (!root) return null;
  return (
    <div className={classes.root}>
      {allCategoryNode()}
      {root.children.map(c => recursiveCategoryNode(c))}
      {root.feeds.map(f => feedNode(f))}
    </div>
  );
};
