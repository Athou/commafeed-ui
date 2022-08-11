import { Trans } from "@lingui/macro"
import { Container, Table, Title } from "@mantine/core"
import { client } from "app/client"
import { Loader } from "components/Loader"
import { RelativeDate } from "components/RelativeDate"
import { useAsync } from "react-use"

export function AdminUsersPage() {
    const query = useAsync(() => client.admin.getAllUsers(), [])
    const users = query.value?.data

    if (!users) return <Loader />
    return (
        <Container>
            <Title order={3}>
                <Trans>Manage users</Trans>
            </Title>
            <Table mt="md" striped highlightOnHover>
                <thead>
                    <tr>
                        <th>
                            <Trans>Id</Trans>
                        </th>
                        <th>
                            <Trans>Name</Trans>
                        </th>
                        <th>
                            <Trans>E-mail</Trans>
                        </th>
                        <th>
                            <Trans>Date created</Trans>
                        </th>
                        <th>
                            <Trans>Last login date</Trans>
                        </th>
                        <th>
                            <Trans>Admin</Trans>
                        </th>
                        <th>
                            <Trans>Enabled</Trans>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                                <RelativeDate date={u.created} />
                            </td>
                            <td>
                                <RelativeDate date={u.lastLogin} />
                            </td>
                            <td>{String(u.admin)}</td>
                            <td>{String(u.enabled)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}
