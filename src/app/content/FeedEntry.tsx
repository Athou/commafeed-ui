import React, { useState } from 'react';
import Moment from 'react-moment';
import { Card, Form } from 'semantic-ui-react';
import { Clients } from '../..';
import { Entry, MarkRequest } from '../../commafeed-api';

interface Props {
    entry: Entry
}

export const FeedEntry: React.FC<Props> = props => {

    const [expanded, setExpanded] = useState(false)
    const [read, setRead] = useState(props.entry.read)

    function toggleExpanded() {
        setExpanded(!expanded)

        if (!expanded && !read) {
            toggleRead()
        }
    }

    function toggleRead() {
        Clients.entry.mark(new MarkRequest({
            id: props.entry.id,
            read: read
        })).then(() => setRead(!read))
    }

    return (
        <Card.Group>
            <Card fluid>
                <Card.Content>
                    <Card.Header onClick={() => toggleExpanded()} className="pointer">
                        <img src={props.entry.iconUrl} alt="feed icon" style={{ width: "24px", height: "24px", marginRight: "5px" }} />
                        <span style={{ fontWeight: read ? "normal" : "bold" }}>
                            {props.entry.title}
                        </span>
                    </Card.Header>
                    <Card.Meta>
                        from {props.entry.feedName} by {props.entry.author}, <Moment fromNow date={props.entry.date} />
                    </Card.Meta>
                    {expanded &&
                        <Card.Description>
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: props.entry.content }} />
                                <Enclosure enclosureType={props.entry.enclosureType} enclosureUrl={props.entry.enclosureUrl} />
                            </div>
                        </Card.Description>
                    }
                </Card.Content>
                {expanded && <Card.Content>
                    <Form.Checkbox label="Keep unread" onClick={() => toggleRead()} />
                </Card.Content>
                }
            </Card>
        </Card.Group>
    )
}

interface EnclosureProps {
    enclosureType?: string
    enclosureUrl?: string
}

const Enclosure: React.FC<EnclosureProps> = props => {
    const hasVideo = props.enclosureType && props.enclosureType.indexOf("video") === 0
    const hasAudio = props.enclosureType && props.enclosureType.indexOf("audio") === 0
    const hasImage = props.enclosureType && props.enclosureType.indexOf("image") === 0
    return (
        <div style={{ paddingTop: "10px" }}>
            {hasVideo && <video controls>
                <source src={props.enclosureUrl} type={props.enclosureType} />
            </video>}
            {hasAudio && <audio controls>
                <source src={props.enclosureUrl} type={props.enclosureType} />
            </audio>}
            {hasImage && <img src={props.enclosureUrl} alt="enclosure" style={{ maxWidth: "100%" }} />}
        </div>
    )
}