import { ActionIcon, AppShell, Box, Burger, Center, Header, MediaQuery, Navbar, ScrollArea, Title } from "@mantine/core"
import { redirectTo } from "app/slices/redirect"
import { setMobileMenuOpen } from "app/slices/tree"
import { useAppDispatch, useAppSelector } from "app/store"
import { useAppTheme } from "hooks/useAppTheme"
import { ReactNode } from "react"
import { TbPlus } from "react-icons/tb"
import { Outlet } from "react-router-dom"
import { Logo } from "./Logo"

interface LayoutProps {
    sidebar: ReactNode
    header: ReactNode
}

function LogoAndTitle() {
    return (
        <Center inline>
            <Logo size={24} />
            <Title order={3} pl="md">
                CommaFeed
            </Title>
        </Center>
    )
}

export default function Layout({ sidebar, header }: LayoutProps) {
    const theme = useAppTheme()
    const mobileMenuOpen = useAppSelector(state => state.tree.mobileMenuOpen)
    const dispatch = useAppDispatch()

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
            navbarOffsetBreakpoint={theme.layout.mobileBreakpoint}
            navbar={
                <Navbar
                    p="xs"
                    hiddenBreakpoint={theme.layout.mobileBreakpoint}
                    hidden={!mobileMenuOpen}
                    width={{ sm: theme.layout.sidebarWidth }}
                >
                    <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                        {sidebar}
                    </Navbar.Section>
                </Navbar>
            }
            header={
                <Header height={theme.layout.headerHeight} p="md">
                    {/* mobile */}
                    <MediaQuery largerThan={theme.layout.mobileBreakpoint} styles={{ display: "none" }}>
                        <Box>
                            {mobileMenuOpen && (
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Box>{burger}</Box>
                                    <Box>
                                        <LogoAndTitle />
                                    </Box>
                                    <Box>
                                        <ActionIcon color={theme.primaryColor} onClick={() => dispatch(redirectTo("/app/add"))}>
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
                        </Box>
                    </MediaQuery>
                    {/* desktop */}
                    <MediaQuery smallerThan={theme.layout.mobileBreakpoint} styles={{ display: "none" }}>
                        <Box sx={{ display: "flex" }}>
                            <Box sx={{ display: "flex", alignItems: "center", width: theme.layout.sidebarWidth - 16 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <LogoAndTitle />
                                </Box>
                                <Box>
                                    <ActionIcon color={theme.primaryColor} onClick={() => dispatch(redirectTo("/app/subscribe"))}>
                                        <TbPlus size={18} />
                                    </ActionIcon>
                                </Box>
                            </Box>
                            <Box sx={{ flexGrow: 1 }} ml="xl">
                                {header}
                            </Box>
                        </Box>
                    </MediaQuery>
                </Header>
            }
        >
            <Outlet />
        </AppShell>
    )
}
