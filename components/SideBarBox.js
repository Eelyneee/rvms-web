import {
    Box,
    VStack,
    Avatar,
    Flex,
    Button,
    Image,
    Text,
    Link,
} from "@chakra-ui/react";
import SideBar from "./SideBar";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { getAdminstratorByID, listenForAdministratorChanges } from "../lib/function-db";
import { useRouter } from "next/router";

const SideBarBox = () => {
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
            console.log(admin_id);
            loadCurrentAdmin();
            listenForAdministratorChanges(loadCurrentAdmin);
        }
    }, [])

    return (
        <>
            <Flex display={{ base: "none", lg: "flex" }} pos="fixed" bg='#f4f4f4' w='25%' color='black' h='100vh' borderTopRightRadius='35' borderBottomRightRadius='35' justify='space-between' flexDirection='column'>
                <Box>
                    <Link href='/profile'>
                        <Flex mb={4} p={4} fontWeight='bold'>
                            {
                                currentAdminData.images == null ?
                                    <Avatar name={currentAdminData.name} src={''} alt="currentAdminData.name" />
                                    :
                                    <Avatar name={currentAdminData.name} src={'https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/' + currentAdminData?.images?.Key} alt="currentAdminData.images.Key" />
                            }
                            {
                                currentAdminData.length != 0 ?
                                    <Box ml={4}>
                                        <Text fontSize='lg'>{currentAdminData.name}</Text>
                                        <Text fontSize='sm'>Role: {currentAdminData.role}</Text>
                                    </Box> : <></>
                            }


                        </Flex>
                    </Link>
                    <VStack
                        align='stretch'
                    >

                        <SideBar href='/' src='/sidebar/home.png' name='Home' />
                        <SideBar href='/residents' src='/sidebar/residents.png' name='Residents' />
                        <SideBar href='/visitors' src='/sidebar/visitors.png' name='Visitors' />
                        <SideBar href='/administrators' src='/sidebar/administrators.png' name='Administrators' />
                        <SideBar href='/securityguards' src='/sidebar/security_guards.png' name='Security Guards' />
                        <SideBar href='/announcements' src='/sidebar/announcement.png' name='Announcement' />
                        <SideBar href='/feedback' src='/sidebar/feedback.png' name='Feedback' />
                    </VStack>
                </Box>
                <Box maxW="340px" mx='auto'>
                    <Button bg='blue' color='#fff' px='20' onClick={() => supabaseClient.auth.signOut()}> Log out</Button>
                </Box>
            </Flex>
        </>)

}

export default SideBarBox;

