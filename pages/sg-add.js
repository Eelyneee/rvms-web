import SideBarBox from "../components/SideBarBox";
import AddSGForm from "../components/AddSGForm";
import { Flex, Box } from '@chakra-ui/react';
import { useState, useRef } from "react";
import { supabaseClient } from "../lib/client";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const AddSG = () => {

    return (
        <Box>
            <Header slug="Add Security Guards" />
            <Box>
                <MyMenu />
                <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <AddSGForm />
                    </Box>
                </Flex>
            </Box>
        </Box>
    )

}

export default AddSG;
