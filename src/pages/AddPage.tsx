import { Container, Tabs } from "@mantine/core"
import { ImportOPML } from "components/content/add/ImportOPML"
import { Subscribe } from "components/content/add/Subscribe"
import { TbFileImport, TbFolderPlus, TbRss } from "react-icons/tb"

export function AddPage() {
    return (
        <Container size="sm" px={0}>
            <Tabs defaultValue="subscribe">
                <Tabs.List>
                    <Tabs.Tab value="subscribe" icon={<TbRss />}>
                        Subscribe
                    </Tabs.Tab>
                    <Tabs.Tab value="category" icon={<TbFolderPlus />}>
                        Add category
                    </Tabs.Tab>
                    <Tabs.Tab value="opml" icon={<TbFileImport />}>
                        OPML
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="subscribe" pt="xl">
                    <Subscribe />
                </Tabs.Panel>

                <Tabs.Panel value="category" pt="xl">
                    TODO
                </Tabs.Panel>

                <Tabs.Panel value="opml" pt="xl">
                    <ImportOPML />
                </Tabs.Panel>
            </Tabs>
        </Container>
    )
}
