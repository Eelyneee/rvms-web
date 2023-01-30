import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Button, Link } from '@chakra-ui/react';
import FeedbackTabs from "../components/FeedbackTabs";
import React, { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { getAllFeedbacks, listenForFeedbackChanges } from "../lib/function-db";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const Feedback = () => {

    return (
        <Box>
            <Header slug="Feedback" />
            <Box>
                <MyMenu />
                <SideBarBox /> <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <FeedbackTabs />
                    </Box>
                </Flex>
            </Box>
        </Box>
    )

}

export default Feedback;

