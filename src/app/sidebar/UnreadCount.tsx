import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
  label: {
    textAlign: "center",
    width: "2.2rem",
    padding: "0 4px",
    borderRadius: "10px",
    fontSize: "0.8em",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
}));

export const UnreadCount: React.FC<{ unreadCount: number }> = props => {
  const classes = useStyles();

  if (props.unreadCount <= 0) return null;

  const count = props.unreadCount >= 1000 ? "999+" : props.unreadCount;
  return <div className={classes.label}>{count}</div>;
};
