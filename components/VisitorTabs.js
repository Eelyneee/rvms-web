import {
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Heading, Box, Badge, Link, FormControl, Input, IconButton, Flex

} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'

import TotalVisitorTable from "./TotalVisitorTable";
import TodayVisitorTable from "./TodayVisitorTable";
import { useState, useRef } from "react";
import { supabaseClient } from "../lib/client"

const VisitorTabs = () => {

    const [tabIndex, setTabIndex] = useState(0)
    const [todayTab, setTodayTab] = useState(true);
    const [totalTab, setTotalTab] = useState(true);

    const handleTab = () => {
        if (tabIndex == 0) {
            setTodayTab(true);
            setTotalTab(false);
        } else if (tabIndex == 1) {
            setTodayTab(false);
            setTotalTab(true);
        }
    }

    return (
        <>

            <Tabs onChange={(index) => setTabIndex(index)}>
                <TabList>
                    <Tab fontSize={{ base: "xs", lg: "md" }}>Today&apos;s Visitors</Tab>
                    <Tab fontSize={{ base: "xs", lg: "md" }}>Visitor&apos;s History</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px="0">
                        <Heading as='h2' size='lg' mb={[4, 4, 8]}>Today&apos;s Visitors</Heading>
                        <TodayVisitorTable tab={handleTab} />
                    </TabPanel>
                    <TabPanel px="0">
                        <Heading as='h2' size='lg' mb={[4, 4, 8]}>Visitor&apos;s History</Heading>

                        <TotalVisitorTable tab={handleTab} />
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </>);
}

export default VisitorTabs;