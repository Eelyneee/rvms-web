import {
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Heading, Box, Badge, Link, FormControl, Input, IconButton, Flex, Tag, TagLabel, TagLeftIcon,
    Icon
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'
import { BsFillCircleFill } from "react-icons/bs";

import NewFeedback from "./NewFeedback";
import RepliedFeedbackTable from "./RepliedFeedbackTable";
import { useState, useRef } from "react";
import { supabaseClient } from "../lib/client"
import FeedbackCategories from "./FeedbackCategories";

const FeedbackTabs = () => {

    const [tabIndex, setTabIndex] = useState(0)
    const [newTab, setNewTab] = useState(true);
    const [repliedTab, setRepliedTab] = useState(true);

    const handleTab = () => {
        if (tabIndex == 0) {
            setNewTab(true);
            setRepliedTab(false);
        } else if (tabIndex == 1) {
            setNewTab(false);
            setRepliedTab(true);
        }
    }

    return (
        <>
            <Tabs onChange={(index) => setTabIndex(index)}>
                <TabList>
                    <Tab fontSize={{ base: "xs", lg: "md" }}>New feedbacks</Tab>
                    <Tab fontSize={{ base: "xs", lg: "md" }}>Replied feedbacks</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px="0">
                        <Heading as='h2' size='lg' mb={[4, 4, 8]}>New feedbacks</Heading>
                        <FeedbackCategories />
                        <NewFeedback tab={handleTab} />
                    </TabPanel>
                    <TabPanel px="0">
                        <Heading as='h2' size='lg' mb={[4, 4, 8]}>Replied feedbacks</Heading>
                        <RepliedFeedbackTable tab={handleTab} />
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </>);
}

export default FeedbackTabs;