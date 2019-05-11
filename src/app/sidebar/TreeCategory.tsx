import React, { useContext, useMemo, useState } from 'react';
import { Icon, SemanticICONS } from 'semantic-ui-react';
import { Clients } from '../..';
import { Category, CollapseRequest } from '../../commafeed-api';
import { flattenCategoryTree } from '../../utils';
import { AppContext } from '../App';
import { ActionCreator } from '../AppReducer';
import { TreeNode } from './TreeNode';
import { UnreadCount } from './UnreadCount';

interface Props {
    category: Category,
    icon?: SemanticICONS
}

export const TreeCategory: React.FC<Props> = props => {

    const [expanded, setExpanded] = useState(props.category.expanded)
    const { dispatch } = useContext(AppContext)


    const unreadCount = useMemo(() => flattenCategoryTree(props.category)
        .flatMap(c => c.feeds)
        .map(f => f.unread)
        .reduce((total, current) => total + current, 0)
        , [props.category])

    function toggleExpanded() {
        Clients.category.collapse(new CollapseRequest({
            id: +props.category.id,
            collapse: expanded
        })).then(() => setExpanded(!expanded))
    }

    return (
        <div style={{ paddingTop: "1px", paddingBottom: "1px" }}>
            <Icon name={props.icon ? props.icon : (expanded ? "chevron down" : "chevron right")}
                onClick={() => toggleExpanded()} className="pointer" />
            <span className="pointer" style={{ fontWeight: (!expanded && unreadCount > 0) ? "bold" : "normal" }}
                onClick={() => dispatch(ActionCreator.redirect.navigateToCategory(props.category.id))}>
                {props.category.name}
            </span>
            {!expanded && <UnreadCount unreadCount={unreadCount} />}
            {
                expanded && (props.category.children.length > 0 || props.category.feeds.length > 0) &&
                <div style={{ marginLeft: "20px" }}>
                    {props.category.children.map(c => <TreeCategory category={c} key={c.id} />)}
                    {props.category.feeds.map(f => <TreeNode subscription={f} key={f.id} />)}
                </div>
            }
        </div>
    )
}