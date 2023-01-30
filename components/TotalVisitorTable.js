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
    Heading, Box, Badge, Link, Button, Text

} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client"
import { createClient } from "@supabase/supabase-js";
import { getAllVisitation, listenForVisitationChanges, getAllSecurityGuard, listenForSGChanges, getVisitationByUnitID } from "../lib/function-db";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";

const TotalVisitorTable = ({ tab }) => {

    const router = useRouter();
    const [visitationData, setVisitationData] = useState([]);
    const [SGData, setGuardData] = useState([]);
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

    const handleViewAll = async () => {
        setSearchData([]);
        setSearchTerm("");
        setSearch(false);
    }

    const onTermSubmit = async (term) => {
        var regex = /^[0-9]*$/;
        if (regex.test(term) == true) {
            setSearchTerm(term);
            const { visitation, error } = await getVisitationByUnitID(term);
            setSearchData(visitation);
            setSearch(true);
            if (visitation.length == 0) {
                setInvalid("Unit ID not found. Please try another unit id.")
                setTimeout(() => {
                    setInvalid("");
                }, 3000);
            }
        } else {
            setValidation("Unit number only contains digits. Please try again.")
            setTimeout(() => {
                setValidation("");
            }, 3000);
        }
    }

    const loadVisitation = async () => {
        const { visitation, error } = await getAllVisitation();
        setVisitationData(visitation);
    }

    const loadAllSG = async () => {
        const { security_guards, error } = await getAllSecurityGuard();
        setGuardData(security_guards);
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadVisitation();
            loadAllSG();
            // listenForVisitationChanges(loadVisitation);
            // listenForSGChanges(loadAllSG);
        }
    }, [tab])


    useEffect(() => {

        loadVisitation();
        loadAllSG();
        // listenForVisitationChanges(loadVisitation);
        // listenForSGChanges(loadAllSG);

    }, [refresh, search])


    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            const client = createClient("https://ldfotgflxcncnaameeig.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZm90Z2ZseGNuY25hYW1lZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ0ODcyMzEsImV4cCI6MTk3MDA2MzIzMX0.ahVip8dq6j2Pmyso84QAYeM10dsYmhF1zEiSYtnE8kc")
            const subscription = client
                .from('visitation')
                .on('*', payload => {
                    console.log('Change received!', payload)
                    loadVisitation();
                    loadAllSG();
                })
                .subscribe()
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [])

    return (
        <>
            <SearchBar placeholder={"Enter unit id to search"} handleSubmit={onTermSubmit} valid={validation} />
            <Button size={{ base: "sm", md: "md" }} colorScheme='blue' variant='outline' mb={[4, 4, 8]} onClick={handleRefresh}>Refresh</Button>
            {
                searchData.length != 0 ? <Box><Button size={{ base: "sm", md: "md" }} bg="blue" color="white" mb={[4, 4, 8]} onClick={handleViewAll}>View All</Button></Box> : <></>
            }
            {
                searchData.length == 0 && search == true ? <Text>{invalid}</Text> : <></>
            }
            <TableContainer>
                <Table variant='simple'>
                    <Thead bg='#FFF3E1'>
                        <Tr>
                            <Th>Visitation ID</Th>
                            <Th>Unit ID</Th>
                            <Th>Name</Th>
                            <Th>IC no</Th>
                            <Th>Phone number</Th>
                            <Th>Car plate</Th>
                            <Th>Visitation date and time</Th>
                            <Th>Check-in date and time</Th>
                            <Th>Verified by</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            searchData.length != 0 ?
                                searchData.map(search => {
                                    const s = SGData.filter((guard) => { return search.security_id == guard.account_id })
                                    return (
                                        <Tr key={search.id}>
                                            <Td>{search.id}</Td>
                                            <Td>{search.unit_id}</Td>
                                            <Td>{search.visitor_name}</Td>
                                            <Td>{search.visitor_ic}</Td>
                                            <Td>{search.phone_no}</Td>
                                            <Td>{search.carplate != "" ? search.carplate : "N/A"}</Td>
                                            <Td>{search.visitation_date + ", " + search.visitation_time}</Td>
                                            <Td>{search.checkin_date ? search.checkin_date + ", " + search.checkin_time : "No checkin data found! "}</Td>
                                            <Td>{s[0] ? s[0]?.name : "No check in data found!"}</Td>
                                        </Tr>
                                    );
                                })
                                :
                                visitationData.map((v) => {
                                    const s = SGData.filter((guard) => { return v.security_id == guard.account_id })
                                    return (
                                        <Tr key={v.id}>
                                            <Td>{v.id}</Td>
                                            <Td>{v.unit_id}</Td>
                                            <Td>{v.visitor_name}</Td>
                                            <Td>{v.visitor_ic}</Td>
                                            <Td>{v.phone_no}</Td>
                                            <Td>{v.carplate != "" ? v.carplate : "N/A"}</Td>
                                            <Td>{v.visitation_date + ", " + v.visitation_time}</Td>
                                            <Td>{v.checkin_date ? v.checkin_date + ", " + v.checkin_time : "No checkin data found! "}</Td>
                                            <Td>{s[0] ? s[0]?.name : "No check in data found!"}</Td>
                                        </Tr>

                                    );
                                })
                        }

                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Visitation ID</Th>
                            <Th>Unit ID</Th>
                            <Th>Name</Th>
                            <Th>IC no</Th>
                            <Th>Phone number</Th>
                            <Th>Car plate</Th>
                            <Th>Visitation date and time</Th>
                            <Th>Check in date and time</Th>
                            <Th>Verified by</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>


        </>);
}

export default TotalVisitorTable;