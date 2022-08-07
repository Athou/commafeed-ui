import { Trans } from "@lingui/macro"
import { Divider, Menu, useMantineColorScheme } from "@mantine/core"
import { redirectToSettings } from "app/slices/redirect"
import { useAppDispatch } from "app/store"
import { TbMoon, TbPower, TbSettings, TbSun } from "react-icons/tb"

interface ProfileMenuProps {
    control: React.ReactElement
}

export function ProfileMenu(props: ProfileMenuProps) {
    const dispatch = useAppDispatch()
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const dark = colorScheme === "dark"

    const logout = () => {
        window.location.href = "logout"
    }

    return (
        <Menu position="bottom-end" closeOnItemClick={false}>
            <Menu.Target>{props.control}</Menu.Target>
            <Menu.Dropdown>
                <Menu.Item icon={<TbSettings />} onClick={() => dispatch(redirectToSettings())}>
                    <Trans>Settings</Trans>
                </Menu.Item>
                <Menu.Item icon={dark ? <TbMoon /> : <TbSun />} onClick={() => toggleColorScheme()}>
                    <Trans>Theme</Trans>
                </Menu.Item>

                <Divider />

                <Menu.Item icon={<TbPower />} onClick={logout}>
                    <Trans>Logout</Trans>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
