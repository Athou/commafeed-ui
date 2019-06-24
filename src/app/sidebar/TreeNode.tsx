import { Box, makeStyles, Typography } from "@material-ui/core";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { UnreadCount } from "./UnreadCount";

const useStyles = (props: Props) =>
  makeStyles(theme => ({
    root: {
      cursor: "pointer",
      paddingTop: "1px",
      paddingBottom: "1px",
      paddingLeft: props.level * 20,
      "&:hover": {
        backgroundColor: theme.palette.action.hover
      }
    },
    active: {
      backgroundColor: theme.palette.action.selected
    },
    name: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    icon: {
      width: "1.5rem",
      height: "1.5rem",
      marginRight: "0.5rem"
    }
  }));

interface Props {
  id: string;
  name: string;
  icon: ReactNode | string;
  unread: number;
  selected: boolean;
  expanded?: boolean;
  level: number;
  onClick: (id: string) => void;
  onIconClick?: (e: React.MouseEvent, id: string) => void;
}
export const TreeNode: React.FC<Props> = React.memo(props => {
  const classes = useStyles(props)();
  return (
    <div
      className={classNames({
        [classes.root]: true,
        [classes.active]: props.selected
      })}
      onClick={() => props.onClick(props.id)}
    >
      <Typography
        variant="body1"
        color={props.unread ? "textPrimary" : "textSecondary"}
        component="span"
      >
        <Box display="flex" alignItems="center">
          <Box
            className={classes.icon}
            onClick={e => props.onIconClick && props.onIconClick(e, props.id)}
          >
            {typeof props.icon === "string" ? (
              <img src={props.icon} alt="favicon" className={classes.icon} />
            ) : (
              props.icon
            )}
          </Box>
          <Box flexGrow={1} className={classes.name}>
            {props.name}
          </Box>
          {!props.expanded && (
            <Box>
              <UnreadCount unreadCount={props.unread} />
            </Box>
          )}
        </Box>
      </Typography>
    </div>
  );
});
