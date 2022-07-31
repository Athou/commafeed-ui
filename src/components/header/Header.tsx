import { Center, createStyles, Divider, Group, Text } from "@mantine/core"
import { openConfirmModal } from "@mantine/modals"
import { markAllEntries, reloadEntries } from "app/slices/entries"
import { changeReadingMode, changeReadingOrder, reloadProfile, reloadSettings } from "app/slices/user"
import { useAppDispatch, useAppSelector } from "app/store"
import { ActionButton } from "components/ActionButtton"
import { Loader } from "components/Loader"
import { useEffect } from "react"
import { TbArrowDown, TbArrowUp, TbChecks, TbEyeCheck, TbEyeOff, TbRefresh, TbUser } from "react-icons/tb"
import { ProfileMenu } from "./ProfileMenu"

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

    const iconSize = 18
    return (
        <Center>
            <Group>
                <ActionButton icon={<TbRefresh size={iconSize} />} label="Refresh" onClick={() => dispatch(reloadEntries())}></ActionButton>
                <HeaderDivider />
                <ActionButton icon={<TbChecks size={iconSize} />} label="Mark all as read" onClick={openMarkAllEntriesModal}></ActionButton>
                <HeaderDivider />
                <ActionButton
                    className={classes.button}
                    icon={settings.readingMode === "all" ? <TbEyeCheck size={iconSize} /> : <TbEyeOff size={iconSize} />}
                    label={settings.readingMode}
                    onClick={() => dispatch(changeReadingMode(settings.readingMode === "all" ? "unread" : "all"))}
                ></ActionButton>
                <ActionButton
                    className={classes.button}
                    icon={settings.readingOrder === "asc" ? <TbArrowUp size={iconSize} /> : <TbArrowDown size={iconSize} />}
                    label={settings.readingOrder}
                    onClick={() => dispatch(changeReadingOrder(settings.readingOrder === "asc" ? "desc" : "asc"))}
                ></ActionButton>
                <HeaderDivider />
                <ProfileMenu control={<ActionButton icon={<TbUser size={iconSize} />} label={profile?.name} />} />
            </Group>
        </Center>
    )
}
