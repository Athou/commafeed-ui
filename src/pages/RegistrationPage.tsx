import { Anchor, Box, Button, Center, Container, Group, Paper, PasswordInput, Stack, TextInput, Title } from "@mantine/core"
import { client, errorToStrings } from "app/client"
import { redirectTo } from "app/slices/redirect"
import { useAppDispatch } from "app/store"
import { RegistrationRequest } from "app/types"
import { Alert } from "components/Alert"
import { Logo } from "components/Logo"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import useMutation from "use-mutation"

export const RegistrationPage = () => {
    const dispatch = useAppDispatch()
    const [registerUser, registerResult] = useMutation(client.user.register, {
        onSuccess: () => {
            dispatch(redirectTo("/"))
        },
    })
    const errors = errorToStrings(registerResult.error)
    const { register, handleSubmit } = useForm<RegistrationRequest>()
    const onSubmit = handleSubmit(registerUser)

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
                    Sign up
                </Title>
                {errors && errors.length > 0 && (
                    <Box mb="md">
                        <Alert messages={errors} />
                    </Box>
                )}
                <form onSubmit={onSubmit}>
                    <Stack>
                        <TextInput label="User Name" placeholder="User Name" {...register("name")} size="md" required />
                        <TextInput label="E-mail address" placeholder="E-mail address" {...register("email")} size="md" required />
                        <PasswordInput label="Password" placeholder="Password" {...register("password")} size="md" required />
                        <Button type="submit" loading={registerResult.status === "running"}>
                            Sign up
                        </Button>
                        <Center>
                            <Group>
                                <Box>Have an account?</Box>
                                <Anchor component={Link} to="/login">
                                    Log in!
                                </Anchor>
                            </Group>
                        </Center>
                    </Stack>
                </form>
            </Paper>
        </Container>
    )
}
