import { Divider, Menu, useMantineColorScheme } from "@mantine/core"
import { FaCogs, FaMoon, FaPowerOff, FaSun } from "react-icons/fa"

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
                <Menu.Item icon={<FaCogs size={14} />}>Settings</Menu.Item>
                <Menu.Item icon={dark ? <FaMoon size={14} /> : <FaSun size={14} />} onClick={() => toggleColorScheme()}>
                    Theme
                </Menu.Item>

                <Divider />

                <Menu.Item icon={<FaPowerOff size={14} />} onClick={() => (window.location.href = "logout")}>
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
