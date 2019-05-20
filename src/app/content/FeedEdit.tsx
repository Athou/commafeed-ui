import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Form, Header } from "semantic-ui-react"
import { Routes } from "../../Routes"

interface Props {
    feedId: string
}

export const FeedEdit: React.FC<Props> = props => {
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState("")

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        if (event) event.preventDefault()

        console.log(name)
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
            setName("Gamekult")
        }, 1000)
    }, [props.feedId])

    return (
        <div>
            <Header as="h3" dividing>
                Feed edit
            </Header>
            <Form loading={loading} onSubmit={handleSubmit}>
                <Form.Input label="Name" value={name} onChange={e => setName(e.target.value)} />
            </Form>
            <Link to={Routes.app.root.create({})}>Back to List</Link>
        </div>
    )
}
