import { Trans } from "@lingui/macro"
import { Tabs } from "@mantine/core"
import { TbPhoto, TbUser } from "react-icons/tb"

export function SettingsPage() {
    return (
        <Tabs orientation="vertical" defaultValue="profile">
            <Tabs.List>
                <Tabs.Tab value="profile" icon={<TbUser />}>
                    <Trans>Profile</Trans>
                </Tabs.Tab>
                <Tabs.Tab value="display" icon={<TbPhoto />}>
                    <Trans>Display</Trans>
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="profile" pl="xs">
                profile placeholder
            </Tabs.Panel>

            <Tabs.Panel value="display" pl="xs">
                display config placeholder
            </Tabs.Panel>
        </Tabs>
    )
}
