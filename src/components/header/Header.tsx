import { ActionIcon, Button, Center, createStyles, Divider, Group, Text, useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { openConfirmModal } from "@mantine/modals"
import { markAllEntries, reloadEntries } from "app/slices/entries"
import { changeReadingMode, changeReadingOrder, reloadProfile, reloadSettings } from "app/slices/user"
import { useAppDispatch, useAppSelector } from "app/store"
import { Loader } from "components/Loader"
import { forwardRef, useEffect } from "react"
import { FaArrowDown, FaArrowUp, FaCheckDouble, FaEye, FaEyeSlash, FaSyncAlt, FaUser } from "react-icons/fa"
import { ProfileMenu } from "./ProfileMenu"

interface HeaderButtonProps {
    className?: string
    icon?: React.ReactNode
    label?: string
    onClick?: React.MouseEventHandler
}

/**
 * Switches between Button with label (desktop) and ActionIcon (mobile)
 */
const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>((props: HeaderButtonProps, ref) => {
    const theme = useMantineTheme()
    const mobile = !useMediaQuery(`(min-width: ${theme.breakpoints.lg}px)`)
    return mobile ? (
        <ActionIcon ref={ref} color={theme.primaryColor} variant="subtle" className={props.className} onClick={props.onClick}>
            {props.icon}
        </ActionIcon>
    ) : (
        <Button ref={ref} variant="subtle" size="xs" className={props.className} leftIcon={props.icon} onClick={props.onClick}>
            {props.label}
        </Button>
    )
})
HeaderButton.displayName = "HeaderButton"

const HeaderDivider = () => <Divider sx={{ height: "28px" }} orientation="vertical" />

const useStyles = createStyles(() => ({
    button: {
        textTransform: "capitalize",
    },
}))

export const Header = () => {
    const { classes } = useStyles()
    const source = useAppSelector(state => state.entries.source)
    const sourceLabel = useAppSelector(state => state.entries.sourceLabel)
    const entriesTimestamp = useAppSelector(state => state.entries.timestamp)
    const settings = useAppSelector(state => state.user.settings)
    const profile = useAppSelector(state => state.user.profile)
    const dispatch = useAppDispatch()

    const openMarkAllEntriesModal = () =>
        openConfirmModal({
            title: "Mark all entries as read",
            centered: true,
            children: <Text size="sm">Are you sure you want to mark all entries of {sourceLabel} as read?</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: () =>
                dispatch(
                    markAllEntries({
                        sourceType: source.type,
                        req: {
                            id: source.id,
                            read: true,
                            olderThan: entriesTimestamp,
                        },
                    })
                ),
        })

    useEffect(() => {
        dispatch(reloadSettings())
        dispatch(reloadProfile())
    }, [dispatch])

    if (!settings) return <Loader />
    return (
        <Center>
            <Group>
                <HeaderButton icon={<FaSyncAlt />} label="Refresh" onClick={() => dispatch(reloadEntries())}></HeaderButton>
                <HeaderDivider />
                <HeaderButton icon={<FaCheckDouble />} label="Mark all as read" onClick={openMarkAllEntriesModal}></HeaderButton>
                <HeaderDivider />
                <HeaderButton
                    className={classes.button}
                    icon={settings.readingMode === "all" ? <FaEye /> : <FaEyeSlash />}
                    label={settings.readingMode}
                    onClick={() => dispatch(changeReadingMode(settings.readingMode === "all" ? "unread" : "all"))}
                ></HeaderButton>
                <HeaderButton
                    className={classes.button}
                    icon={settings.readingOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                    label={settings.readingOrder}
                    onClick={() => dispatch(changeReadingOrder(settings.readingOrder === "asc" ? "desc" : "asc"))}
                ></HeaderButton>
                <HeaderDivider />
                <ProfileMenu control={<HeaderButton icon={<FaUser />} label={profile?.name} />} />
            </Group>
        </Center>
    )
}
