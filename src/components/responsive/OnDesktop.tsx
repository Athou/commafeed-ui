import { Box, MediaQuery } from "@mantine/core"
import { mobileBreakpoint } from "Layout"
import React from "react"

export function OnDesktop(props: { children: React.ReactNode }) {
    return (
        <MediaQuery smallerThan={mobileBreakpoint} styles={{ display: "none" }}>
            <Box>{props.children}</Box>
        </MediaQuery>
    )
}
