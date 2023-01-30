import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Button, Link, Avatar, Text, Center, VStack, Divider, FormControl, Textarea, Alert, AlertTitle, AlertIcon, AlertDescription, Badge } from '@chakra-ui/react';

import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { useRouter } from "next/router";
import { getFeedbackByID, listenForFeedbackChanges, getResidentByID, listenForResident, getAdminstratorByID, listenForAdministratorChanges, saveReply } from "../lib/function-db";
import { getFeedbackCategoryColor, getFeedbackCategoryLabel, getFeedbackCategoryBGColor, capitalizeFirstLetter } from "../lib/function";
import Header from "../components/Header";
import MyMenu from "../components/Menu";

const FeedbackReply = () => {

    const router = useRouter();
    const [feedbackData, setFeedbackData] = useState([]);
    const [residentData, setResidentData] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [clickReply, setClickReply] = useState(false);
    const [content, setContent] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [contentVal, setContentValid] = useState("");
    const [pass, setPass] = useState(false);
    const [submit, setSubmit] = useState(0);

    //validation

    let feedback_id = router.query.id;
    let admin_id = supabaseClient.auth.user()?.id;

    const handleReply = async () => {
        setSubmit(submit + 1);
        if (content == "") {
            setPass(false);
            setContentValid("Please enter your reply message content. ");
        } else {

            setPass(true);
        }
    }

    useEffect(() => {
        (async () => {
            if (pass == true && clickReply == true) {
                content = capitalizeFirstLetter(content);
                console.log(content)
                const { error } = await saveReply(feedback_id, admin_id, content);
                if (error) {
                    console.log("Error handly reply message: " + error);
                } else {
                    setShowAlert(true)
                    setTimeout(() => {
                        router.push("/feedback");
                    }, 3000);
                }
            }
        })();
    }, [submit])

    const loadFeedback = async () => {
        const { feedbacks, error } = await getFeedbackByID(feedback_id);
        setFeedbackData(feedbacks);
    }

    const loadResident = async () => {
        setLoading(false);
        if (feedbackData.resident_id != undefined && isLoading == false) {
            const { residents, error } = await getResidentByID(feedbackData.resident_id);
            setResidentData(residents);
        }
    }

    const loadAdministrator = async () => {
        const { administrator, error } = await getAdminstratorByID(admin_id);
        setAdminData(administrator);
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadFeedback();
            loadAdministrator();
            listenForFeedbackChanges(loadFeedback);
            listenForAdministratorChanges(loadFeedback);
        }
    }, [])

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            setLoading(false);
            loadResident();
            listenForResident(loadResident);
        }
    }, [feedbackData]);

    return (
        <Box>
            <Header slug="Reply Feedback" />
            <Box>
                <MyMenu />
                <SideBarBox /> <SideBarBox />
                <Flex>
                    <Box w={{ base: "0%", lg: "25%" }} h='100vh' />
                    <Box w={{ base: "100%", lg: "75%" }} px={5} mt={[0, 0, 0, 10]} pb={32}>
                        <Box mb={5}>
                            <Link href="/feedback">{"< Back"}</Link>
                        </Box>
                        <Heading as='h2' size='lg' mb={4}>Feedback from resident</Heading>
                        {!isLoading ?
                            <Box>
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
                                <Heading as='h3' size='md' my={4}>{feedbackData?.title}</Heading>
                                <Box maxW={["100%", "100%", "75%"]} minH={["200px", "200px", "350px"]} borderWidth={1} borderColor='#000' borderRadius={5} px={4} mb={8}>
                                    <Heading as='h4' size='sm' my={4}>Details</Heading>
                                    <Text p={4} > {feedbackData?.description}</Text>
                                </Box>
                                {
                                    clickReply ?
                                        <Flex justify='start'>
                                            <Button mb={8} isDisabled onClick={() => { setClickReply(true); }}>Reply</Button>
                                        </Flex> :
                                        <Flex justify='start'>
                                            <Button mb={8} bg='blue' color='white' onClick={() => { setClickReply(true); }}>Reply</Button>
                                        </Flex>
                                }
                            </Box> :
                            <Text mb={2}>Loading Feedback...</Text>

                        }

                        {!clickReply || showAlert ? <></> : <Box>
                            <Box>
                                <FormControl>
                                    <Box p={4} mb={8}>
                                        <Heading as='h4' size='sm'>Replies</Heading>
                                        <Text fontSize='xs' mb={4}>By: {adminData.name}</Text>
                                        {!pass && <Text color="red" fontSize="xs" mb="2">{contentVal}</Text>}
                                        <Textarea maxW={["100%", "100%", "75%"]} minH={["200px", "200px", "350px"]} borderWidth={1} borderColor='#000' borderRadius={5}
                                            value={content} onChange={(e) => setContent(e.target.value)}
                                            placeholder='Enter your reply'
                                            size='lg'
                                        />
                                        <Flex justify='end' mt={4}>
                                            <Button bg='blue' color='white' onClick={handleReply}>Send reply</Button>
                                        </Flex>
                                    </Box>
                                </FormControl>
                            </Box>
                        </Box>}
                        {showAlert ?
                            <Alert status='success'>
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>Success!</AlertTitle>
                                    <AlertDescription>
                                        Your reply is saved.
                                    </AlertDescription>
                                </Box>
                            </Alert>
                            : <></>}


                    </Box>
                </Flex>
            </Box>
        </Box>
    )

}

export default FeedbackReply;

