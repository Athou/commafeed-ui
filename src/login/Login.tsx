import { Button, Container, TextField } from "@material-ui/core"
import React, { useState } from "react"
import { RouteComponentProps } from "react-router"
import { clients } from ".."
import { LoginRequest } from "../api/commafeed-api"
import { Routes } from "../Routes"

export const Login: React.FC<RouteComponentProps> = props => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        if (event) event.preventDefault()

        clients.user
            .login(
                new LoginRequest({
                    name,
                    password
                })
            )
            .then(() => props.history.push(Routes.app.root.create({})))
            .catch(error => console.log(error))
    }

    return (
        <Container>
            <form onSubmit={e => handleSubmit(e)}>
                <TextField onChange={e => setName(e.target.value)} />
                <TextField type="password" onChange={e => setPassword(e.target.value)} />
                <Button type="submit">Login</Button>
            </form>
        </Container>
    )
}
