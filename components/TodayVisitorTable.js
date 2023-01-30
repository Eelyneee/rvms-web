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
    Heading, Box, Badge, Link, Text, Button

} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { createClient } from "@supabase/supabase-js";
import { getTodayVisitation, listenForVisitationChanges, getAllSecurityGuard, listenForSGChanges, } from "../lib/function-db";
import { getTodayDate } from "../lib/function";
import { useRouter } from "next/router";

const TodayVisitorTable = ({ tab }) => {
    const router = useRouter();

    const [visitationData, setVisitationData] = useState([]);
    const [SGData, setGuardData] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }

    const loadVisitation = async () => {
        var date = getTodayDate();
        const { visitation, error } = await getTodayVisitation(date);
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
    }, [tab, refresh])

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
            <Button size={{ base: "sm", md: "md" }} colorScheme='blue' variant='outline' mb={[4, 4, 8]} onClick={handleRefresh}>Refresh</Button>
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
                            visitationData.length == 0 ? <Tr><Td colSpan="9"><Text>No visitor registered today.</Text></Td></Tr> :
                                visitationData.map((v) => {
                                    const s = SGData.filter((guard) => { return v.security_id == guard.account_id })
                                    return (
                                        <Tr key={v.id}>
                                            <Td>{v.id}</Td>
                                            <Td>{v.unit_id}</Td>
                                            <Td>{v.visitor_name}</Td>
                                            <Td>{v.visitor_ic}</Td>
                                            <Td>{v.phone_no}</Td>
                                            <Td>{v.carplate}</Td>
                                            <Td>{v.visitation_date + " " + v.visitation_time}</Td>
                                            <Td>{v.checkin_date ? v.checkin_date + " " + v.checkin_time : "No checkin data found! "}</Td>
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

export default TodayVisitorTable;