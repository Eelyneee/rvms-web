import SideBarBox from "../components/SideBarBox";
import AddAdminForm from "../components/AddAdminForm";
import { Flex, Box } from '@chakra-ui/react';
import { useState, useRef } from "react";
import { supabaseClient } from "../lib/client";
import MyMenu from "../components/Menu";
import Header from "../components/Header";


const AddAdmin = () => {

    return (
        <Box>
            <Header slug="Add Administrator" />
            <Box>
                <MyMenu />
                <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <AddAdminForm />
                    </Box>
                </Flex>
            </Box>
        </Box>

    )

}

export default AddAdmin;

