
import {
    Heading, Text, Box, Badge, Link, Button, Center, Flex, Avatar, SimpleGrid

} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client"
import { createClient } from "@supabase/supabase-js";
import { getFeedbackCategoryColor, getFeedbackCategoryLabel, getFeedbackCategoryBGColor } from "../lib/function";
import { getAllResident, getNewFeedbacks, listenForFeedbackChanges, listenForResident, getResidentAccountData, listenForAccountChanges } from "../lib/function-db";
import NextLink from "next/link"
import { useRouter } from "next/router";

const NewFeedback = ({ tab }) => {
    const router = useRouter();
    const [feedbackData, setFeedbackData] = useState([]);
    const [residentData, setResidentData] = useState([]);
    const [accountData, setAccountData] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }

    const loadFeedback = async () => {
        const { feedbacks, error } = await getNewFeedbacks();
        setFeedbackData(feedbacks);
    }

    const loadResident = async () => {
        const { residents, error } = await getAllResident();
        setResidentData(residents);
    }

    const loadAccount = async () => {
        const { accounts, error } = await getResidentAccountData();
        setAccountData(accounts);
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadFeedback();
            loadResident();
            loadAccount();
            // listenForFeedbackChanges(loadFeedback);
            // listenForResident(loadResident);
            // listenForAccountChanges(loadAccount);
        }
    }, [tab, refresh])

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            const client = createClient("https://ldfotgflxcncnaameeig.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZm90Z2ZseGNuY25hYW1lZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ0ODcyMzEsImV4cCI6MTk3MDA2MzIzMX0.ahVip8dq6j2Pmyso84QAYeM10dsYmhF1zEiSYtnE8kc")
            const subscription = client
                .from('feedbacks')
                .on('*', payload => {
                    console.log('Change received!', payload)
                    loadFeedback();
                    loadResident();
                    loadAccount();
                })
                .subscribe()
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [])

    return (
        <>

            <Button size={{ base: "sm", md: "md" }} colorScheme='blue' variant='outline' my={[4, 4, 8]} onClick={handleRefresh}>Refresh</Button>
            <SimpleGrid columns={[1, 2, 2, 3, 4]} spacing={1} px={2} mt={2} mb={8}>
                {
                    feedbackData != null ?
                        feedbackData.map((feedback) => {
                            const resident = residentData.filter((resident) => { return feedback.resident_id == resident.account_id });
                            const account = accountData.filter((account) => { return resident[0]?.account_id == account.id });
                            return (
                                <Box bg={getFeedbackCategoryBGColor(feedback.category)} w='100%' maxH='350' maxW="280px" borderRadius='10' p={4} pt={2} my={4} key={feedback.id} justifyContent="center" alignItems="center">
                                    <Center mb="5">
                                        <Badge fontSize='0.5em' variant='outline' color={getFeedbackCategoryColor(feedback.category)} bg='#fff' p={1} borderRadius={5} mr={2}>{getFeedbackCategoryLabel(feedback.category)}</Badge>
                                    </Center>
                                    <Heading as='h3' size='md' mb={1} >{feedback.title}</Heading>
                                    <Text fontSize='sm' mb={4} pl={2} noOfLines={1}>{feedback.description}</Text>
                                    <Flex align='center' mb={4}>
                                        <Avatar name={resident[0]?.name} src='' />
                                        <Box ml={5}>
                                            <Text fontSize='sm' fontWeight='bold' mb={1}>{resident[0]?.name}</Text>
                                            <Text fontSize='xs' fontWeight='bold' mb={1}>{account[0]?.email}</Text>
                                            <Text fontSize='xs' >Unit id: {resident[0]?.unit_id}</Text>
                                        </Box>
                                    </Flex>
                                    <Center>
                                        <NextLink href={{ pathname: "/feedback-reply", query: { id: feedback.id } }} passHref>
                                            <Link w='75%' maxW='150px' bg='#fff' color='blue' border='1px' borderStyle='solid' borderColor='blue' borderRadius={5}>
                                                <Center>
                                                    <Button bg='#fff' color='blue' >Reply</Button>
                                                </Center>
                                            </Link>
                                        </NextLink>
                                    </Center>

                                </Box>
                            );
                        }) : <Text>No feedback found.</Text>
                }
            </SimpleGrid>
        </>);
}

export default NewFeedback;