import { ActionIcon, Button } from "@mantine/core"
import { useAppTheme } from "hooks/useAppTheme"
import { forwardRef } from "react"
import { OnDesktop } from "./responsive/OnDesktop"
import { OnMobile } from "./responsive/OnMobile"

interface ActionButtonProps {
    className?: string
    icon?: React.ReactNode
    label?: string
    onClick?: React.MouseEventHandler
}

/**
 * Switches between Button with label (desktop) and ActionIcon (mobile)
 */
export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>((props: ActionButtonProps, ref) => {
    const theme = useAppTheme()
    return (
        <>
            <OnMobile>
                <ActionIcon ref={ref} color={theme.primaryColor} variant="subtle" className={props.className} onClick={props.onClick}>
                    {props.icon}
                </ActionIcon>
            </OnMobile>
            <OnDesktop>
                <Button ref={ref} variant="subtle" size="xs" className={props.className} leftIcon={props.icon} onClick={props.onClick}>
                    {props.label}
                </Button>
            </OnDesktop>
        </>
    )
})
ActionButton.displayName = "HeaderButton"
