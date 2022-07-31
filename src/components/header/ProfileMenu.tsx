import { Divider, Menu, useMantineColorScheme } from "@mantine/core"
import { TbMoon, TbPower, TbSettings, TbSun } from "react-icons/tb"

interface ProfileMenuProps {
    control: React.ReactElement
}

export const ProfileMenu = (props: ProfileMenuProps) => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const dark = colorScheme === "dark"

    return (
        <Menu position="bottom-end" closeOnItemClick={false}>
            <Menu.Target>{props.control}</Menu.Target>
            <Menu.Dropdown>
                <Menu.Item icon={<TbSettings />}>Settings</Menu.Item>
                <Menu.Item icon={dark ? <TbMoon /> : <TbSun />} onClick={() => toggleColorScheme()}>
                    Theme
                </Menu.Item>

                <Divider />

                <Menu.Item icon={<TbPower />} onClick={() => (window.location.href = "logout")}>
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
