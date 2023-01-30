import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Button, Link } from '@chakra-ui/react';
import AdministratorTable from "../components/AdministratorTable";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { getAdminstratorByID } from "../lib/function-db";
import { useRouter } from "next/router";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const Administrator = () => {
    const router = useRouter();
    let admin_id = supabaseClient.auth.user()?.id;
    let [adminData, setAdminData] = useState([]);

    const loadAccount = async () => {
        const { administrator, error } = await getAdminstratorByID(admin_id);
        setAdminData(administrator);
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadAccount();
        }
    }, [])

    return (
        <Box>
            <Header slug="Administrator" />
            <Box>
                <MyMenu />
                <SideBarBox /> <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <Heading as='h2' size='lg' mb={[4, 4, 8]}>Administrators</Heading>
                        {
                            adminData.length != 0 && adminData.role != 'staff' ?
                                <Link href={"/admin-add"} >
                                    <Button size={{ base: "sm", md: "md" }} mb={4} bg='blue' color='white'>Add Administrators</Button>
                                </Link> : <></>
                        }
                        <AdministratorTable />
                    </Box>
                </Flex>
            </Box>
        </Box>
    )

}

export default Administrator;

