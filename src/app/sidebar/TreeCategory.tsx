import React, { useContext, useState } from 'react';
import { Icon, SemanticICONS } from 'semantic-ui-react';
import { Clients } from '../..';
import { Category, CollapseRequest } from '../../commafeed-api';
import { AppContext } from '../App';
import { TreeNode } from './TreeNode';

interface Props {
    category: Category,
    icon?: SemanticICONS
}

export const TreeCategory: React.FC<Props> = props => {

    const [expanded, setExpanded] = useState(props.category.expanded)
    const { dispatch } = useContext(AppContext)

    function toggleExpanded() {
        Clients.category.collapse(new CollapseRequest({
            id: +props.category.id,
            collapse: expanded
        })).then(() => setExpanded(!expanded))
    }

    return (
        <div>
            <Icon name={props.icon ? props.icon : (expanded ? "chevron down" : "chevron right")}
                onClick={() => toggleExpanded()} className="pointer" />
            <span className="pointer" onClick={() => dispatch({ type: "navigateToCategory", categoryId: props.category.id })}>
                {props.category.name}
            </span>
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