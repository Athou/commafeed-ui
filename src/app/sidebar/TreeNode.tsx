import React, { useContext } from 'react';
import { Subscription } from '../../commafeed-api';
import { AppContext } from '../App';
import { UnreadCount } from './UnreadCount';

interface Props {
    subscription: Subscription
}

export const TreeNode: React.FC<Props> = props => {
    const { dispatch } = useContext(AppContext)
    return (
        <div>
            <img src={props.subscription.iconUrl} alt="favicon"
                style={{ width: "16px", height: "16px", marginRight: "5px", position: "relative", top: "4px" }} />
            <span style={{ fontWeight: props.subscription.unread > 0 ? "bold" : "normal" }} className="pointer"
                onClick={() => dispatch({ type: "navigateToFeed", feedId: props.subscription.id })}>
                {props.subscription.name}
            </span>
            <UnreadCount unreadCount={props.subscription.unread} />
        </div>
    )
}