import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Button, Link } from '@chakra-ui/react';
import AnnouncementForm from "../components/AnnouncementForm";
import { useState, useRef } from "react";
import { supabaseClient } from "../lib/client";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const Announcement = () => {

    return (
        <Box>
            <Header slug="Add Announcement" />
            <Box>
                <MyMenu />
                <SideBarBox /> <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <Box mb={5}>
                            <Link href="/announcements">{"< Back"}</Link>
                        </Box>
                        <AnnouncementForm />
                    </Box>
                </Flex>
            </Box>
        </Box>
    )

}

export default Announcement;

