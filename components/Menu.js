import {
    Flex, Image, Text, Link, Menu, MenuButton, MenuList, MenuItem, IconButton, Avatar, Box, Center, Button
} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons'
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { getAdminstratorByID, listenForAdministratorChanges } from "../lib/function-db";
import { useRouter } from "next/router";

const MyMenu = () => {
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
        <Box>
            <Center display={{ base: "center", lg: "none" }} bg="#4484ff" w="100%" color="#fff" fontFamily={"monospace"} fontSize={{ base: "lg", lg: "xl" }} fontWeight="bold" py="1">RVMS</Center>
            <Flex display={{ base: "flex", lg: "none" }} justifyContent="space-between" m={[4, 4, 8]}>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<HamburgerIcon />}
                        variant='outline'
                    />
                    <MenuList>
                        <MenuItem>
                            <Link color='teal.500' href='/'>
                                <Flex px={4} py={2} align='center' fontWeight='bold' color='#797979'>
                                    <Image
                                        boxSize='15px'
                                        objectFit='cover'
                                        src={'/sidebar/home.png'}
                                        alt='home'
                                    />
                                    <Text fontSize='sm' ml={4}>Home</Text>
                                </Flex>
                            </Link>
                        </MenuItem>
                        <MenuItem >
                            <Link color='teal.500' href='/residents'>
                                <Flex px={4} py={2} align='center' fontWeight='bold' color='#797979'>
                                    <Image
                                        boxSize='15px'
                                        objectFit='cover'
                                        src={'/sidebar/residents.png'}
                                        alt='residents'
                                    />
                                    <Text fontSize='sm' ml={4}>Residents</Text>
                                </Flex>
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link color='teal.500' href='/visitors'>
                                <Flex px={4} py={2} align='center' fontWeight='bold' color='#797979'>
                                    <Image
                                        boxSize='15px'
                                        objectFit='cover'
                                        src={'/sidebar/visitors.png'}
                                        alt='visitors'
                                    />
                                    <Text fontSize='sm' ml={4}>Visitors</Text>
                                </Flex>
                            </Link>
                        </MenuItem>
                        <MenuItem >
                            <Link color='teal.500' href='/administrators'>
                                <Flex px={4} py={2} align='center' fontWeight='bold' color='#797979'>
                                    <Image
                                        boxSize='15px'
                                        objectFit='cover'
                                        src={'/sidebar/administrators.png'}
                                        alt='administrators'
                                    />
                                    <Text fontSize='sm' ml={4}>Administrators</Text>
                                </Flex>
                            </Link>
                        </MenuItem>
                        <MenuItem >
                            <Link color='teal.500' href='/securityguards'>
                                <Flex px={4} py={2} align='center' fontWeight='bold' color='#797979'>
                                    <Image
                                        boxSize='15px'
                                        objectFit='cover'
                                        src={'/sidebar/security_guards.png'}
                                        alt='security guards'
                                    />
                                    <Text fontSize='sm' ml={4}>Security Guards</Text>
                                </Flex>
                            </Link>
                        </MenuItem>
                        <MenuItem >
                            <Link color='teal.500' href='/announcements'>
                                <Flex px={4} py={2} align='center' fontWeight='bold' color='#797979'>
                                    <Image
                                        boxSize='15px'
                                        objectFit='cover'
                                        src={'/sidebar/announcement.png'}
                                        alt='announcements'
                                    />
                                    <Text fontSize='sm' ml={4}>Announcement</Text>
                                </Flex>
                            </Link>
                        </MenuItem>
                        <MenuItem >
                            <Link color='teal.500' href='/feedback'>
                                <Flex px={4} py={2} align='center' fontWeight='bold' color='#797979'>
                                    <Image
                                        boxSize='15px'
                                        objectFit='cover'
                                        src={'/sidebar/feedback.png'}
                                        alt='feedback'
                                    />
                                    <Text fontSize='sm' ml={4}>Feedback</Text>
                                </Flex>
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            {/* <Box maxW="340px" mx='auto'>
                                <Button bg='blue' color='#fff' px='20' onClick={() => supabaseClient.auth.signOut()}> Log out</Button>
                            </Box> */}
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Link href='/profile'>
                    <Flex>
                        {
                            currentAdminData.images == null ?
                                <Avatar name={currentAdminData.name} src={''} alt="currentAdminData.name" size='sm' />
                                :
                                <Avatar name={currentAdminData.name} src={'https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/' + currentAdminData?.images?.Key} alt="currentAdminData.images.Key" />
                        }
                        {
                            currentAdminData.length != 0 ?
                                <Box ml={4}>
                                    <Text fontSize='xs'>{currentAdminData.name}</Text>
                                    <Text fontSize='xs'>Role: {currentAdminData.role}</Text>
                                </Box> : <></>
                        }
                    </Flex>
                </Link>
            </Flex>
        </Box>);

}

export default MyMenu;

