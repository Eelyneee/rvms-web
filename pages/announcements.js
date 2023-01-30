import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Button, Link, Text } from '@chakra-ui/react';
import AnnouncementCard from "../components/AnnouncementCard";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { createClient } from "@supabase/supabase-js";
import { getAllAdministrator, listenForAdministratorChanges, listenForAnnouncementChanges, getDraftAnnouncement, getPublishedAnnouncement, listenForAnnouncement } from "../lib/function-db";
import { useRouter } from "next/router";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const Announcements = () => {

    const router = useRouter();
    const [draftAnnouncement, setDraftAnnouncement] = useState([]);
    const [publishedAnnouncement, setPublishedAnnouncement] = useState([]);
    const [adminData, setAdminData] = useState([]);
    let admin_id = supabaseClient.auth.user()?.id;
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }

    const loadDraftAnnouncement = async () => {
        const { announcements, error } = await getDraftAnnouncement(admin_id);
        setDraftAnnouncement(announcements);
    }

    const loadPublishedAnnouncement = async () => {
        const { announcements, error } = await getPublishedAnnouncement();
        setPublishedAnnouncement(announcements);
    }

    const loadAllAdmin = async () => {
        const { administrators, error } = await getAllAdministrator();
        setAdminData(administrators);
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadDraftAnnouncement();
            loadPublishedAnnouncement();
            loadAllAdmin();
            supabaseClient
                .from('announcements')
                .on('*', payload => {
                    console.log("Update!", payload)
                })
                .subscribe()
            // listenForAnnouncementChanges(loadDraftAnnouncement);
            // listenForAnnouncementChanges(loadPublishedAnnouncement);
            // listenForAdministratorChanges(loadAllAdmin);
        }
    }, [])


    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadDraftAnnouncement();
            loadPublishedAnnouncement();
            loadAllAdmin();
            // listenForAnnouncementChanges(loadDraftAnnouncement);
            // listenForAnnouncementChanges(loadPublishedAnnouncement);
            // listenForAdministratorChanges(loadAllAdmin);
        }
    }, [refresh])

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            const client = createClient("https://ldfotgflxcncnaameeig.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZm90Z2ZseGNuY25hYW1lZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ0ODcyMzEsImV4cCI6MTk3MDA2MzIzMX0.ahVip8dq6j2Pmyso84QAYeM10dsYmhF1zEiSYtnE8kc")
            const subscription = client
                .from('announcements')
                .on('*', payload => {
                    console.log('Change received!', payload)
                    loadDraftAnnouncement();
                    loadPublishedAnnouncement();
                    loadAllAdmin();
                })
                .subscribe()
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [])


    return (
        <Box>
            <Header slug="Announcement" />
            <Box>
                <MyMenu />
                <SideBarBox /> <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <Heading as='h2' size='lg' mb={8}>Announcements</Heading>
                        <Link color='teal.500' href={'/announcement-add'}>
                            <Button size={{ base: "sm", md: "md" }} bg='blue' color='white' mb={4}>Add new announcement</Button>
                        </Link>
                        <Box>
                            <Button size={{ base: "sm", md: "md" }} colorScheme='blue' variant='outline' mb={[4, 4, 8]} onClick={handleRefresh}>Refresh</Button>
                        </Box>
                        <Heading as='h3' size='md' mb={[0, 0, 4]}>Your Draft Announcement</Heading>
                        <Box mb={8}>
                            {
                                draftAnnouncement.length == 0 ? <Text>No draft announcement.</Text> :
                                    draftAnnouncement.map((announcement) => {
                                        const admin = adminData.filter((admin) => { return announcement.admin_id == admin.account_id });
                                        return (
                                            <AnnouncementCard key={announcement.id} name={admin[0]?.name} title={announcement.title} description={announcement.description} id={announcement.id} edit={true} />
                                        );
                                    })

                            }
                        </Box>
                        <Heading as='h3' size='md' mb={[0, 0, 4]}>All Published Announcement</Heading>
                        {
                            publishedAnnouncement.map((announcement) => {
                                const admin = adminData.filter((admin) => { return announcement.admin_id == admin.account_id });
                                return (
                                    <AnnouncementCard key={announcement.id} name={admin[0]?.name} title={announcement.title} description={announcement.description} id={announcement.id} edit={false} date={announcement.publish_date} time={announcement.publish_time} />
                                );
                            })
                        }
                    </Box>
                </Flex>
            </Box>
        </Box>
    )

}

export default Announcements;

