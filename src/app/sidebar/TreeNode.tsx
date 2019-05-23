import { Box, makeStyles, Typography } from "@material-ui/core"
import classNames from "classnames"
import React, { useContext } from "react"
import { Subscription } from "../../api/commafeed-api"
import { AppContext } from "../App"
import { ActionCreator } from "../AppReducer"
import { UnreadCount } from "./UnreadCount"

const useStyles = makeStyles(theme => ({
    root: {
        cursor: "pointer",
        paddingTop: "1px",
        paddingBottom: "1px",
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
}))

export const TreeNode: React.FC<{ subscription: Subscription }> = props => {
    const { state, dispatch } = useContext(AppContext)
    const classes = useStyles()

    const selected = state.entries.source === "feed" && state.entries.id === String(props.subscription.id)
    const unread = props.subscription.unread

    return (
        <div
            className={classNames({
                [classes.root]: true,
                [classes.active]: selected
            })}
            onClick={() => dispatch(ActionCreator.redirect.navigateToFeed(props.subscription.id))}
        >
            <Typography variant="body1" color={unread ? "textPrimary" : "textSecondary"} component="span">
                <Box display="flex" alignItems="center">
                    <Box className={classes.icon}>
                        <img src={props.subscription.iconUrl} alt="favicon" className={classes.icon} />
                    </Box>
                    <Box flexGrow={1} className={classes.name}>
                        {props.subscription.name}
                    </Box>
                    <Box>
                        <UnreadCount unreadCount={props.subscription.unread} />
                    </Box>
                </Box>
            </Typography>
        </div>
    )
}
