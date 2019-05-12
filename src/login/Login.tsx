import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Clients } from '..';
import { LoginRequest } from '../commafeed-api';

export const Login: React.FC<RouteComponentProps> = props => {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        if (event)
            event.preventDefault()

        Clients.user.login(new LoginRequest({
            name,
            password
        })).then(() => props.history.push("/app"))
            .catch(error => console.log(error))
    }

    return (
        <div className="login-form">
            <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
                height: 100%;
            }
        `}
            </style>
            <Grid textAlign="center" style={{ height: "100%" }} verticalAlign="middle">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" color="teal" textAlign="center">
                        <Image src="/logo.png" /> Log-in to your account
                </Header>
                    <Form size="large" onSubmit={handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid icon="user" iconPosition="left" placeholder="E-mail address"
                                value={name} onChange={e => setName(e.target.value)} />
                            <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password"
                                value={password} onChange={e => setPassword(e.target.value)} />
                            <Button color="teal" fluid size="large">Login</Button>
                        </Segment>
                    </Form>
                    <Message><a href="google.com">Register</a></Message>
                </Grid.Column>
            </Grid>
        </div>
    )
}
