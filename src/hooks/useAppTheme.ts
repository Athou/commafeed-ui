import { useMantineTheme } from "@mantine/core"

export const useAppTheme = () => {
    const theme = useMantineTheme()
    const layout = {
        mobileBreakpoint: theme.breakpoints.md,
        headerHeight: 60,
        sidebarWidth: 350,
    } as const

    return { ...theme, layout }
}
