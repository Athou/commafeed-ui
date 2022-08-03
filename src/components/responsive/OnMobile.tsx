import { Box, MediaQuery } from "@mantine/core"
import { useAppTheme } from "hooks/useAppTheme"
import React from "react"

export function OnMobile(props: { children: React.ReactNode }) {
    const theme = useAppTheme()
    return (
        <MediaQuery largerThan={theme.layout.mobileBreakpoint} styles={{ display: "none" }}>
            <Box>{props.children}</Box>
        </MediaQuery>
    )
}
