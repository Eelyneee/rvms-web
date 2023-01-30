import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Button, Link } from '@chakra-ui/react';
import SecurityGuardsTable from '../components/SecurityGuardsTable';
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { getAdminstratorByID } from "../lib/function-db";
import { useRouter } from "next/router";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const SecurityGuards = () => {
    const router = useRouter();
    let admin_id = supabaseClient.auth.user()?.id;
    let [currentAdminData, setCurrentAdminData] = useState([]);

    const loadCurrentAdmin = async () => {
        const { administrator, error } = await getAdminstratorByID(admin_id);
        setCurrentAdminData(administrator);
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadCurrentAdmin();
        }
    }, [])

    return (
        <Box>
            <Header slug="Security Guards" />
            <Box>
                <MyMenu />
                <SideBarBox /> <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <Heading as='h2' size='lg' mb={8}>Security Guards</Heading>
                        {
                            currentAdminData.length != 0 && currentAdminData.role != 'staff' ?
                                <Link href="/sg-add">
                                    <Button size={{ base: "sm", md: "md" }} mb={4} bg='blue' color='white'>Add Security Guards</Button>
                                </Link> : <></>
                        }

                        <SecurityGuardsTable />
                    </Box>
                </Flex>
            </Box>
        </Box>
    )

}

export default SecurityGuards;

