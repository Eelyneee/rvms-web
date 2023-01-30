import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Text, Button, Link, Image } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { getAnnouncementByID, listenForAnnouncementChanges, getAdminstratorByID, listenForAdministratorChanges } from "../lib/function-db";
import AnnouncementForm from "../components/AnnouncementForm";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const EditAnnouncement = () => {
    const router = useRouter();
    let [announcementData, setAnnouncementData] = useState();
    let [adminData, setAdminData] = useState();
    let announcement_id = router.query.id;

    const loadAnnouncement = async () => {
        const { announcements, error } = await getAnnouncementByID(announcement_id);
        setAnnouncementData(announcements);
        console.log(error);
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
            <Header slug="Edit Announcement" />
            <Box>
                <MyMenu />
                <SideBarBox /> <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <Box mb={5}>
                            <Link href="/announcements">{"< Back"}</Link>
                        </Box>
                        {
                            announcementData != null ?
                                <AnnouncementForm eID={announcement_id} eAdminID={announcementData.admin_id} eTitle={announcementData.title} eDescription={announcementData.description} eAdminName={adminData?.name} eImage={announcementData.images} edit={1} /> :
                                <Box>
                                    <Text>No announcement found</Text>
                                </Box>
                        }
                    </Box>
                </Flex>
            </Box>
        </Box>
    )

}

export default EditAnnouncement;

