import SideBarBox from "../components/SideBarBox";
import Profile from "../components/Profile";
import { Flex, Box } from '@chakra-ui/react';
import { useState, useRef } from "react";
import { supabaseClient } from "../lib/client";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const ProfilePage = () => {

    return (
        <Box>
            <Header slug="Profile" />
            <Box>
                <MyMenu />
                <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Profile />
                </Flex>
            </Box>
        </Box>
    )

}

export default ProfilePage;

