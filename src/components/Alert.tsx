import { t } from "@lingui/macro"
import { Alert as MantineAlert, Box, MantineColor } from "@mantine/core"
import React, { Fragment } from "react"
import { TbCircleX } from "react-icons/tb"

export interface ErrorsAlertProps {
    title?: string
    color?: MantineColor
    icon?: React.ReactNode
    messages: string[]
}

export function Alert(props: ErrorsAlertProps) {
    const title = props.title ?? t`Error!`
    const color = props.color ?? "red"
    const icon = props.icon ?? <TbCircleX />
    return (
        <MantineAlert title={title} color={color} icon={icon}>
            {props.messages.map((m, i) => (
                <Fragment key={m}>
                    <Box>{m}</Box>
                    {i !== props.messages.length - 1 && <br />}
                </Fragment>
            ))}
        </MantineAlert>
    )
}
