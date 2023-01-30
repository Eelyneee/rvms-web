
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Heading, Box, Badge, Link, Button, Text, FormControl, Input, IconButton, Flex

} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { createClient } from "@supabase/supabase-js";
import { getFeedbackCategoryColor, getFeedbackCategoryLabel, getFeedbackCategoryBGColor } from "../lib/function";
import { getAllResident, getRepliedFeedback, listenForFeedbackChanges, listenForResident, getResidentAccountData, listenForAccountChanges, getResidentsByUnitID } from "../lib/function-db";
import NextLink from "next/link"
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";

const RepliedFeedbackTable = ({ tab }) => {
    const router = useRouter();
    const [feedbackData, setFeedbackData] = useState([]);
    const [residentData, setResidentData] = useState([]);
    const [accountData, setAccountData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [search, setSearch] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [validation, setValidation] = useState("");
    const [invalid, setInvalid] = useState("");

    const handleRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }

    const handleViewAll = () => {
        setSearchData([]);
        setSearchTerm("");
        setSearch(false);
    }

    const onTermSubmit = async (event) => {
        var regex = /^[0-9]*$/;
        if (regex.test(searchTerm) == true) {
            event.preventDefault();
            setSearch(true);
            const { residents, error } = await getResidentsByUnitID(searchTerm);
            if (!error) {
                setSearchData(residents);
                if (residents.length == 0) {
                    setInvalid("Unit ID not found. Please try another unit id.")
                    setTimeout(() => {
                        setInvalid("");
                    }, 3000);
                }
            }
        }
        else {
            setValidation("Unit number only contains digits. Please try again.")
            setTimeout(() => {
                setValidation("");
            }, 3000);
        }
    }

    const loadFeedback = async () => {
        const { feedbacks, error } = await getRepliedFeedback();
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
            <FormControl mb={[4, 4, 8]}>
                <Flex justify='end'>
                    <Input id='search' w={["100%", "50%"]} bg='#EFEFEF' borderRadius='20' placeholder={"Enter unit id to search"}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton aria-label='Search database' icon={<SearchIcon />} borderRadius='20' onClick={onTermSubmit} />
                </Flex>
                <Text textAlign="right" mt="2" textColor="red">{validation}</Text>
            </FormControl>
            {
                searchData.length != 0 ? <Box><Button size={{ base: "sm", md: "md" }} bg="blue" color="white" mb={4} onClick={handleViewAll}>View All</Button></Box> : <></>
            }
            <Button size={{ base: "sm", md: "md" }} colorScheme='blue' variant='outline' mb={[4, 4, 8]} onClick={handleRefresh}>Refresh</Button>
            {
                searchData.length == 0 && search == true ? <Text mb="2">{invalid}</Text> : <></>
            }
            <TableContainer>
                <Table variant='simple'>
                    <Thead bg='#F4F0FE'>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Descriptions</Th>
                            <Th>Category</Th>
                            <Th>Reported by</Th>
                            <Th>Email address</Th>
                            <Th>Unit ID</Th>
                            <Th>View</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            searchData.length != 0 ?
                                // in side all feedback show feedback those have the resident id
                                // try to do in db side
                                searchData.map((search) => {
                                    return feedbackData.map((feedback) => {
                                        if (feedback.resident_id == search.account_id) {

                                            return (
                                                <Tr key={feedback.id}>
                                                    <Td>{feedback.title}</Td>
                                                    <Td><Text maxW="300px" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">{feedback.description}</Text></Td>
                                                    <Td>
                                                        <Badge variant='outline' color={getFeedbackCategoryColor(feedback.category)} bg={getFeedbackCategoryBGColor(feedback.category)} p={1} borderRadius={5} mr={2}>{getFeedbackCategoryLabel(feedback.category)}</Badge>

                                                    </Td>
                                                    <Td>{search.name}</Td>
                                                    <Td>{search.accounts.email}</Td>
                                                    <Td>{search.unit_id}</Td>
                                                    <Td> <Link href='#'>
                                                        <NextLink href={{ pathname: "/feedback-view", query: { id: feedback.id } }} passHref>
                                                            <Link> <Badge variant='outline' colorScheme='blue' bg='#EDF3FF' p={1} borderRadius={5}>View</Badge>
                                                            </Link>
                                                        </NextLink>
                                                    </Link></Td>

                                                </Tr>
                                            );
                                        }

                                    })
                                })
                                :
                                feedbackData.map((feedback) => {
                                    const resident = residentData.filter((resident) => { return feedback.resident_id == resident.account_id });
                                    const account = accountData.filter((account) => { return resident[0]?.account_id == account.id });
                                    return (
                                        <Tr key={feedback.id}>
                                            <Td>{feedback.title}</Td>
                                            <Td><Text maxW="300px" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">{feedback.description}</Text></Td>
                                            <Td>
                                                <Badge variant='outline' color={getFeedbackCategoryColor(feedback.category)} bg={getFeedbackCategoryBGColor(feedback.category)} p={1} borderRadius={5} mr={2}>{getFeedbackCategoryLabel(feedback.category)}</Badge>

                                            </Td>
                                            <Td>{resident[0]?.name}</Td>
                                            <Td>{account[0]?.email}</Td>
                                            <Td>{resident[0]?.unit_id}</Td>
                                            <Td> <Link href='#'>

                                                <NextLink href={{ pathname: "/feedback-view", query: { id: feedback.id } }} passHref>
                                                    <Link> <Badge variant='outline' colorScheme='blue' bg='#EDF3FF' p={1} borderRadius={5}>View</Badge>
                                                    </Link>
                                                </NextLink>

                                            </Link></Td>
                                        </Tr>
                                    );
                                })
                        }



                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Details</Th>
                            <Th>Category</Th>
                            <Th>Reported by</Th>
                            <Th>Email address</Th>
                            <Th>Unit ID</Th>
                            <Th>View</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>

        </>);
}

export default RepliedFeedbackTable;