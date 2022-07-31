import { Alert as MantineAlert, Box, MantineColor } from "@mantine/core"
import { Fragment } from "react"

export interface ErrorsAlertProps {
    title?: string
    color?: MantineColor
    messages: string[]
}

export function Alert(props: ErrorsAlertProps) {
    const title = props.title ?? "Error!"
    const color = props.color ?? "red"
    return (
        <MantineAlert title={title} color={color}>
            {props.messages.map((m, i) => (
                <Fragment key={m}>
                    <Box>{m}</Box>
                    {i !== props.messages.length - 1 && <br />}
                </Fragment>
            ))}
        </MantineAlert>
    )
}
