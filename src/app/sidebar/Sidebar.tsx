import { makeStyles, Divider } from "@material-ui/core";
import React from "react";
import { AppConstants } from "../AppConstants";
import { Tree } from "./Tree";

const useStyles = makeStyles({
  root: {
    paddingTop: AppConstants.NAVBAR_HEIGHT
  }
});

export const Sidebar: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Divider />
      <Tree />
    </div>
  );
};
