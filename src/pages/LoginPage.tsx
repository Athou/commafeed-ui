import { Anchor, Box, Button, Center, Container, Group, Paper, PasswordInput, Stack, TextInput, Title } from "@mantine/core"
import { client, errorToStrings } from "app/client"
import { redirectTo } from "app/slices/redirect"
import { useAppDispatch } from "app/store"
import { LoginRequest } from "app/types"
import { Alert } from "components/Alert"
import { Logo } from "components/Logo"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import useMutation from "use-mutation"

export const LoginPage = () => {
    const dispatch = useAppDispatch()
    const [login, loginResult] = useMutation(client.user.login, {
        onSuccess: () => {
            dispatch(redirectTo("/"))
        },
    })
    const errors = errorToStrings(loginResult.error)
    const { register, handleSubmit } = useForm<LoginRequest>()
    const onSubmit = handleSubmit(login)

    return (
        <Container size="xs">
            <Center mt="xl">
                <Logo size={48} />
                <Title order={1} ml="md">
                    CommaFeed
                </Title>
            </Center>
            <Paper>
                <Title order={2} mb="md">
                    Log in
                </Title>
                {errors && errors.length > 0 && (
                    <Box mb="md">
                        <Alert messages={errors} />
                    </Box>
                )}
                <form onSubmit={onSubmit}>
                    <Stack>
                        <TextInput label="User Name or E-mail" placeholder="User Name or E-mail" {...register("name")} size="md" required />
                        <PasswordInput label="Password" placeholder="Password" {...register("password")} size="md" required />
                        <Button type="submit" loading={loginResult.status === "running"}>
                            Log in
                        </Button>
                        <Center>
                            <Group>
                                <Box>Need an account?</Box>
                                <Anchor component={Link} to="/register">
                                    Sign up!
                                </Anchor>
                            </Group>
                        </Center>
                    </Stack>
                </form>
            </Paper>
        </Container>
    )
}
