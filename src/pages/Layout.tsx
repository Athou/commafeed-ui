import {
    ActionIcon,
    Anchor,
    AppShell,
    Box,
    Burger,
    Center,
    createStyles,
    DEFAULT_THEME,
    Header,
    Navbar,
    ScrollArea,
    Title,
    useMantineTheme,
} from "@mantine/core"
import { useViewportSize } from "@mantine/hooks"
import { Constants } from "app/constants"
import { redirectToAdd, redirectToRootCategory } from "app/slices/redirect"
import { reloadTree, setMobileMenuOpen } from "app/slices/tree"
import { reloadProfile, reloadSettings } from "app/slices/user"
import { useAppDispatch, useAppSelector } from "app/store"
import { Logo } from "components/Logo"
import { OnDesktop } from "components/responsive/OnDesktop"
import { OnMobile } from "components/responsive/OnMobile"
import { ReactNode, useEffect } from "react"
import { TbPlus } from "react-icons/tb"
import { Outlet } from "react-router-dom"

interface LayoutProps {
    sidebar: ReactNode
    header: ReactNode
}

const sidebarPadding = DEFAULT_THEME.spacing.xs
const sidebarRightBorderWidth = 1

const useStyles = createStyles(theme => ({
    sidebarContent: {
        maxWidth: Constants.layout.sidebarWidth - sidebarPadding * 2 - sidebarRightBorderWidth,
        [theme.fn.smallerThan(Constants.layout.mobileBreakpoint)]: {
            maxWidth: `calc(100vw - ${sidebarPadding * 2 + sidebarRightBorderWidth}px)`,
        },
    },
    mainContentWrapper: {
        paddingTop: Constants.layout.headerHeight,
        paddingLeft: Constants.layout.sidebarWidth,
        paddingRight: 0,
        paddingBottom: 0,
        [theme.fn.smallerThan(Constants.layout.mobileBreakpoint)]: {
            paddingLeft: 0,
        },
    },
    mainContent: {
        maxWidth: `calc(100vw - ${Constants.layout.sidebarWidth}px)`,
        [theme.fn.smallerThan(Constants.layout.mobileBreakpoint)]: {
            maxWidth: "100vw",
        },
    },
}))

function LogoAndTitle() {
    const dispatch = useAppDispatch()
    return (
        <Anchor onClick={() => dispatch(redirectToRootCategory())} variant="text">
            <Center inline>
                <Logo size={24} />
                <Title order={3} pl="md">
                    CommaFeed
                </Title>
            </Center>
        </Anchor>
    )
}

export default function Layout({ sidebar, header }: LayoutProps) {
    const { classes } = useStyles()
    const theme = useMantineTheme()
    const viewport = useViewportSize()
    const mobileMenuOpen = useAppSelector(state => state.tree.mobileMenuOpen)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(reloadSettings())
        dispatch(reloadProfile())
        dispatch(reloadTree())

        // reload tree periodically
        const id = setInterval(() => dispatch(reloadTree()), 30000)
        return () => clearInterval(id)
    }, [dispatch])

    const burger = (
        <Burger
            color={theme.fn.variant({ color: theme.primaryColor, variant: "subtle" }).color}
            opened={mobileMenuOpen}
            onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
            size="sm"
        />
    )

    return (
        <AppShell
            fixed
            navbarOffsetBreakpoint={Constants.layout.mobileBreakpoint}
            classNames={{ main: classes.mainContentWrapper }}
            navbar={
                <Navbar
                    p={sidebarPadding}
                    hiddenBreakpoint={Constants.layout.mobileBreakpoint}
                    hidden={!mobileMenuOpen}
                    width={{ md: Constants.layout.sidebarWidth }}
                >
                    <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                        <Box className={classes.sidebarContent}>{sidebar}</Box>
                    </Navbar.Section>
                </Navbar>
            }
            header={
                <Header height={Constants.layout.headerHeight} p="md">
                    <OnMobile>
                        {mobileMenuOpen && (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box>{burger}</Box>
                                <Box>
                                    <LogoAndTitle />
                                </Box>
                                <Box>
                                    <ActionIcon color={theme.primaryColor} onClick={() => dispatch(redirectToAdd())}>
                                        <TbPlus size={18} />
                                    </ActionIcon>
                                </Box>
                                {!mobileMenuOpen && <Box>{header}</Box>}
                            </Box>
                        )}
                        {!mobileMenuOpen && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box mr="sm">{burger}</Box>
                                <Box sx={{ flexGrow: 1 }}>{header}</Box>
                            </Box>
                        )}
                    </OnMobile>
                    <OnDesktop>
                        <Box sx={{ display: "flex" }}>
                            <Box sx={{ display: "flex", alignItems: "center", width: Constants.layout.sidebarWidth - 16 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <LogoAndTitle />
                                </Box>
                                <Box>
                                    <ActionIcon color={theme.primaryColor} onClick={() => dispatch(redirectToAdd())}>
                                        <TbPlus size={18} />
                                    </ActionIcon>
                                </Box>
                            </Box>
                            <Box sx={{ flexGrow: 1 }} ml="xl">
                                {header}
                            </Box>
                        </Box>
                    </OnDesktop>
                </Header>
            }
        >
            <ScrollArea.Autosize
                maxHeight={viewport.height - Constants.layout.headerHeight}
                viewportRef={ref => {
                    if (ref) ref.id = Constants.dom.mainScrollAreaId
                }}
            >
                <Box p="md" className={classes.mainContent}>
                    <Outlet />
                </Box>
            </ScrollArea.Autosize>
        </AppShell>
    )
}
