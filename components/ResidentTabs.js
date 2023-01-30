import {
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Heading, Box, Badge, Link, FormControl, Input, IconButton, Flex

} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'

import NewResidentTable from "./NewResidentTable";
import ExistingResidentTable from "./ExistingResidentTable";
import { useState, useRef } from "react";
import { supabaseClient } from "../lib/client"

import SearchBar from "./SearchBar";

const ResidentTabs = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const [newTab, setNewTab] = useState(true);
    const [eTab, setETab] = useState(true);

    const handleTab = () => {
        if (tabIndex == 0) {
            setNewTab(true);
            setETab(false);
        } else if (tabIndex == 1) {
            setNewTab(false);
            setETab(true);
        }
    }

    return (
        <>
            <Tabs onChange={(index) => setTabIndex(index)}>
                <TabList>
                    <Tab fontSize={{ base: "xs", lg: "md" }}>New Residents Application</Tab>
                    <Tab fontSize={{ base: "xs", lg: "md" }}>Exisitng Residents</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px="0">
                        <Heading as='h2' size='lg' mb={[4, 4, 8]}>New Residents Application</Heading>
                        <NewResidentTable tab={handleTab} />
                    </TabPanel>
                    <TabPanel px="0">
                        <Heading as='h2' size='lg' mb={[4, 4, 8]}>Exisitng Residents</Heading>
                        <ExistingResidentTable tab={handleTab} />
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </>);
}

export default ResidentTabs;