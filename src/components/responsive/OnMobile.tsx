import { Box, MediaQuery } from "@mantine/core"
import { mobileBreakpoint } from "Layout"
import React from "react"

export function OnMobile(props: { children: React.ReactNode }) {
    return (
        <MediaQuery largerThan={mobileBreakpoint} styles={{ display: "none" }}>
            <Box>{props.children}</Box>
        </MediaQuery>
    )
}
