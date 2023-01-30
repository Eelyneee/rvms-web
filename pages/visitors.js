import SideBarBox from "../components/SideBarBox";
import { Flex, Box } from '@chakra-ui/react';
import VisitorTabs from "../components/VisitorTabs";
import { useState, useRef } from "react";
import { supabaseClient } from "../lib/client";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const Visitor = () => {

    return (
        <Box>
            <Header slug="Visitors" />
            <Box>
                <Box>
                    <MyMenu />
                    <SideBarBox /> <SideBarBox />
                    <Flex>
                        <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                        <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                            <VisitorTabs />
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Box>
    )

}

export default Visitor;

