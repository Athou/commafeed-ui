import { Avatar, Button, Container, makeStyles, TextField, Typography } from "@material-ui/core"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import React, { useState } from "react"
import { RouteComponentProps } from "react-router"
import { clients } from ".."
import { LoginRequest } from "../api/commafeed-api"
import { Routes } from "../Routes"

const useStyles = makeStyles(theme => ({
    header: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    submit: {
        margin: theme.spacing(3, 0)
    }
}))

export const Login: React.FC<RouteComponentProps> = props => {
    const classes = useStyles()
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
        <Container maxWidth="xs">
            <div className={classes.header}>
                <Avatar>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
            </div>
            <form onSubmit={e => handleSubmit(e)}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="User Name or E-mail"
                    autoComplete="email"
                    autoFocus
                    onChange={e => setName(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={e => setPassword(e.target.value)}
                />
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    Login
                </Button>
            </form>
        </Container>
    )
}
