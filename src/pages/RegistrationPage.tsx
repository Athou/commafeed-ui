import { Anchor, Box, Button, Center, Container, Group, Paper, PasswordInput, Stack, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { client, errorToStrings } from "app/client"
import { redirectTo } from "app/slices/redirect"
import { useAppDispatch } from "app/store"
import { RegistrationRequest } from "app/types"
import { Alert } from "components/Alert"
import { Logo } from "components/Logo"
import { Link } from "react-router-dom"
import useMutation from "use-mutation"

export function RegistrationPage() {
    const dispatch = useAppDispatch()

    const form = useForm<RegistrationRequest>({
        initialValues: {
            name: "",
            password: "",
            email: "",
        },
    })

    const [register, registerResult] = useMutation(client.user.register, {
        onSuccess: () => {
            dispatch(redirectTo("/"))
        },
    })
    const errors = errorToStrings(registerResult.error)

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
                {errors.length > 0 && (
                    <Box mb="md">
                        <Alert messages={errors} />
                    </Box>
                )}
                <form onSubmit={form.onSubmit(register)}>
                    <Stack>
                        <TextInput label="User Name" placeholder="User Name" {...form.getInputProps("name")} size="md" required />
                        <TextInput
                            label="E-mail address"
                            placeholder="E-mail address"
                            {...form.getInputProps("email")}
                            size="md"
                            required
                        />
                        <PasswordInput label="Password" placeholder="Password" {...form.getInputProps("password")} size="md" required />
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
