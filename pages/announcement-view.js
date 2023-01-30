import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Text, Button, Link, Image } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { getAnnouncementByID, getAdminstratorByID, listenForAdministratorChanges, listenForAnnouncementChanges } from "../lib/function-db";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const ViewAnnouncement = () => {
    const router = useRouter();
    let [announcementData, setAnnouncementData] = useState();
    let [adminData, setAdminData] = useState();
    let announcement_id = router.query.id;

    const loadAnnouncement = async () => {
        const { announcements, error } = await getAnnouncementByID(announcement_id);
        setAnnouncementData(announcements);
    }

    const loadAdministrator = async () => {
        if (announcementData != null) {
            const { administrator, error } = await getAdminstratorByID(announcementData.admin_id);
            setAdminData(administrator);
        }
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadAnnouncement();
            listenForAnnouncementChanges(loadAnnouncement);
        }
    }, []);

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadAdministrator();
            listenForAdministratorChanges(loadAdministrator);
        }
    }, [announcementData]);

    return (
        <Box>
            <Header slug="View Announcement" />
            <Box>
                <MyMenu />
                <SideBarBox /> <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />

                    {
                        announcementData != null ?
                            <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                                <Box mb={5}>
                                    <Link href="/announcements">{"< Back"}</Link>
                                </Box>
                                <Heading as='h3' size='md' >{announcementData.title}</Heading>
                                <Text fontSize='sm' mb={1}> By: {adminData != null ? adminData.name : announcementData.admin_id}</Text>
                                {announcementData.publish_date != null ? <Text fontSize='sm' mb={1} >Published at: {announcementData.publish_date + " " + announcementData.publish_time}</Text> : <Text>No date</Text>}
                                {
                                    announcementData.images ?

                                        <Image src={'https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/' + announcementData.images.Key} alt='announcementData.images.Key' mt={4} mb={8}
                                            boxSize='350px'
                                            objectFit='cover'
                                            fallbackSrc='https://via.placeholder.com/150'
                                        />
                                        : <Image src={'https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/announcement.img/fallback'} alt='announcementData.images.Key' mt={4} mb={8}
                                            width='500px'
                                            hieght='350px'
                                            objectFit='cover'
                                        />
                                }
                                <Text whiteSpace="pre-wrap">{announcementData.description}</Text>
                            </Box> : <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}></Box>
                    }
                </Flex>
            </Box>
        </Box>
    )

}

export default ViewAnnouncement;

