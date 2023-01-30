import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Button, Link, Avatar, Text, Center, VStack, Divider, Badge } from '@chakra-ui/react';

import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { useRouter } from "next/router";
import { getFeedbackByID, listenForFeedbackChanges, getResidentByID, listenForResident, getFeedbackReplied, getAdminstratorByID, listenForAdministratorChanges } from "../lib/function-db";
import { getFeedbackCategoryBGColor, getFeedbackCategoryLabel, getFeedbackCategoryColor } from "../lib/function";
import MyMenu from "../components/Menu";
import Header from "../components/Header";

const FeedbackView = () => {
    const router = useRouter();
    const [feedbackData, setFeedbackData] = useState([]);
    const [residentData, setResidentData] = useState([]);
    const [replyData, setReplyData] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    let feedback_id = router.query.id;

    const loadFeedback = async () => {
        const { feedbacks, error } = await getFeedbackByID(feedback_id);
        setFeedbackData(feedbacks);
    }

    const loadResident = async () => {
        if (feedbackData.resident_id != undefined && isLoading == false) {
            const { residents, error } = await getResidentByID(feedbackData.resident_id);
            setResidentData(residents);
        }
    }
    const loadReply = async () => {
        const { replies, error } = await getFeedbackReplied(feedback_id);
        setReplyData(replies);
    }

    const loadAdministrator = async () => {
        if (replyData.length != 0) {
            const { administrator, error } = await getAdminstratorByID(replyData.admin_id);
            setAdminData(administrator);
        }
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadFeedback();
            listenForFeedbackChanges(loadFeedback);
        }
    }, [])

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            setLoading(false);
            loadResident();
            listenForResident(loadResident);
            if (feedbackData.status == "replied") {
                loadReply();
                setLoading(true);
            }
        }
    }, [feedbackData]);

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            setLoading(false);
            loadAdministrator();
            listenForAdministratorChanges(loadAdministrator);
        }
    }, [replyData])

    return (
        <Box>
            <Header slug="View Feedback" />
            <Box>
                <MyMenu />
                <SideBarBox /> <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <Box mb={5}>
                            <Link href="/feedback">{"< Back"}</Link>
                        </Box>
                        {!isLoading ?
                            <Box>
                                <Text mb={2}>By: </Text>
                                <Flex mb={8}>
                                    <Avatar ml={4} name={residentData?.name} src='' />
                                    <Box ml={4}>
                                        <Text fontSize='sm' fontWeight='bold' mt={0}> {residentData?.name}</Text>
                                        <Text fontSize='xs' fontWeight='medium' mt={0}>{residentData?.phone_no}</Text>
                                        <Text fontSize='xs' mt={0}> Unit ID: {residentData?.unit_id}</Text>
                                    </Box>
                                </Flex>
                                <Box mb="8" >
                                    <Badge fontSize='0.5em' variant='outline' color={getFeedbackCategoryColor(feedbackData?.category)} bg={getFeedbackCategoryBGColor(feedbackData?.category)} p={1} borderRadius={5} mr={2}>{getFeedbackCategoryLabel(feedbackData?.category)}</Badge>
                                </Box>
                                <Heading as='h3' size='md' mb={4}>{feedbackData?.title}</Heading>

                                <Box maxW={["100%", "100%", "75%"]} minH={["200px", "200px", "350px"]} borderWidth={1} borderColor='#000' borderRadius={5} p={4} mb={8}>
                                    <Heading as='h4' size='sm' mb={4}>Details</Heading>
                                    <Text p={4} > {feedbackData?.description}</Text>
                                </Box>
                            </Box> :
                            <Text mb={2}>Feedback data not found</Text>
                        }
                        {
                            !isLoading ?
                                replyData.length == 0 ?
                                    <Box>
                                        <Divider orientation='horizontal' m={5} colorScheme={"secondary"} size="xl" />
                                        <Text>No reply from management teams yet.</Text>
                                    </Box>
                                    :
                                    <Box>
                                        <Box maxW={["100%", "100%", "75%"]} minH={["200px", "200px", "350px"]} borderWidth={1} borderColor='#000' borderRadius={5} p={4} mb={8}>
                                            <Heading as='h4' size='sm'>Replies</Heading>
                                            <Text fontSize='xs' mb={4}>By: {adminData.name}</Text>
                                            <Text p={4} >{replyData?.content}</Text>
                                        </Box>
                                    </Box>
                                : <Text>Loading</Text>

                        }
                    </Box>
                </Flex>
            </Box>
        </Box>
    )

}

export default FeedbackView;

