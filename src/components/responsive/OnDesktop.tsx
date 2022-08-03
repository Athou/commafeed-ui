import { Box, MediaQuery } from "@mantine/core"
import { useAppTheme } from "hooks/useAppTheme"
import React from "react"

export function OnDesktop(props: { children: React.ReactNode }) {
    const theme = useAppTheme()
    return (
        <MediaQuery smallerThan={theme.layout.mobileBreakpoint} styles={{ display: "none" }}>
            <Box>{props.children}</Box>
        </MediaQuery>
    )
}
