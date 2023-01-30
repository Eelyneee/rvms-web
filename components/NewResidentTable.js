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
    Heading, Box, Badge, Link, Button, Text, Alert, AlertIcon, AlertTitle, AlertDescription, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter

} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { createClient } from "@supabase/supabase-js";
import { getPendingResidentRegistration, getAllResident, getResidentAccountData, getHouseUnit, listenForResident, listenForRegistration, listenForAccountChanges, updateRegistration, deleteResident } from "../lib/function-db";
import { useRouter } from "next/router";


const NewResidentTable = ({ tab }) => {
    const router = useRouter();
    const [registrationData, setRegistrationData] = useState([]);
    const [residentData, setResidentData] = useState([]);
    const [accountData, setAccountData] = useState([]);
    const [unitData, setUnitData] = useState([]);
    let admin_id = supabaseClient.auth.user()?.id;
    const [approve, setApprove] = useState(false);
    const [reject, setReject] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [callReject, setCallReject] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNew, setSelectedNew] = useState({});

    const handleRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }

    const handleOpen = (newRegistration) => {
        setIsOpen(true);
        setSelectedNew(newRegistration);
    }


    const handleReject = async (id) => {
        console.log("hi reject " + id)
        // db -> remove registration -> remove resident -> remove account -> remove users
        const { error } = await deleteResident(id);
        if (!error) {
            setIsOpen(false);
            setReject(true);
            setTimeout(() => {
                setReject(false);
            }, 3000);
        }
    }

    const handleApprove = async (registration_id) => {
        let status = "approved";
        const { error } = await updateRegistration(registration_id, status, admin_id);
        if (!error) {
            setApprove(true);
            setTimeout(() => {
                setApprove(false);
            }, 3000);
        }
    }

    const loadAllRegistration = async () => {
        const { residents_registration, error } = await getPendingResidentRegistration();
        setRegistrationData(residents_registration);
    }

    const loadResident = async () => {
        const { residents, error } = await getAllResident();
        setResidentData(residents);
    }

    const loadAccount = async () => {
        const { accounts, error } = await getResidentAccountData();
        setAccountData(accounts);
    }

    const loadHouseUnit = async () => {
        const { house_unit, error } = await getHouseUnit();
        setUnitData(house_unit);
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadAllRegistration();
            loadResident();
            loadAccount();
            loadHouseUnit();
            // listenForRegistration(loadAllRegistration);
            // listenForResident(loadResident);
            // listenForAccountChanges(loadAccount);
        }
    }, [tab]);

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadAllRegistration();
            loadResident();
            loadAccount();
            loadHouseUnit();
        }
    }, [approve, reject, refresh])

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            const client = createClient("https://ldfotgflxcncnaameeig.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZm90Z2ZseGNuY25hYW1lZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ0ODcyMzEsImV4cCI6MTk3MDA2MzIzMX0.ahVip8dq6j2Pmyso84QAYeM10dsYmhF1zEiSYtnE8kc")
            const subscription = client
                .from('residents')
                .on('*', payload => {
                    console.log('Change received!', payload)
                    loadResident();
                })
                .subscribe()
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [])

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            const client = createClient("https://ldfotgflxcncnaameeig.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZm90Z2ZseGNuY25hYW1lZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ0ODcyMzEsImV4cCI6MTk3MDA2MzIzMX0.ahVip8dq6j2Pmyso84QAYeM10dsYmhF1zEiSYtnE8kc")
            const subscription = client
                .from('residents_registration')
                .on('*', payload => {
                    console.log('Change received!', payload)
                    loadAllRegistration();
                })
                .subscribe()
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [])

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            const client = createClient("https://ldfotgflxcncnaameeig.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZm90Z2ZseGNuY25hYW1lZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ0ODcyMzEsImV4cCI6MTk3MDA2MzIzMX0.ahVip8dq6j2Pmyso84QAYeM10dsYmhF1zEiSYtnE8kc")
            const subscription = client
                .from('accounts')
                .on('*', payload => {
                    console.log('Change received!', payload)
                    loadAccount();
                })
                .subscribe()
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [])

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            const client = createClient("https://ldfotgflxcncnaameeig.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZm90Z2ZseGNuY25hYW1lZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ0ODcyMzEsImV4cCI6MTk3MDA2MzIzMX0.ahVip8dq6j2Pmyso84QAYeM10dsYmhF1zEiSYtnE8kc")
            const subscription = client
                .from('house_unit')
                .on('*', payload => {
                    console.log('Change received!', payload)
                    loadHouseUnit();
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
            {reject ?
                <Alert status='error' mb={3}>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                            Resident&apos;s registration is rejected and resident&apos;s information will be deleted from database.
                        </AlertDescription>
                    </Box>
                </Alert> : <></>}
            {approve ?
                <Alert status='success' mb={3}>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                            Resident&apos;s registration is approved.
                        </AlertDescription>
                    </Box>
                </Alert> : <></>}
            <TableContainer>
                <Table variant='simple'>
                    <Thead bg='#D7E5FF'>
                        <Tr>
                            <Th>Name</Th>
                            <Th>IC no</Th>
                            <Th>Email Address</Th>
                            <Th>Phone number</Th>
                            <Th>Unit ID</Th>
                            <Th><Text width="300px">Address</Text></Th>
                            <Th><Text width="120px" whiteSpace="normal">Registered Car plate</Text></Th>
                            <Th><Text width="120px" whiteSpace="normal">Supporting Document</Text></Th>
                            <Th><Text width="100px" whiteSpace="normal">Approval Status</Text></Th>
                            <Th>Approve or Reject</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            registrationData.length != 0 ?
                                registrationData.map((registration) => {
                                    const resident = residentData.filter((resident) => { return registration.id == resident.registration_id })
                                    const account = accountData.filter((account) => { return resident[0]?.account_id == account.id });
                                    const unit = unitData.filter((unit) => { return resident[0]?.unit_id == unit.unit_id });
                                    return (
                                        <Tr key={registration.id}>
                                            <Td>{resident[0]?.name}</Td>
                                            <Td>{resident[0]?.ic}</Td>
                                            <Td>{account[0]?.email}</Td>
                                            <Td>{resident[0]?.phone_no}</Td>
                                            <Td>{resident[0]?.unit_id}</Td>
                                            <Td whiteSpace="normal">{unit[0]?.address}</Td>
                                            <Td>{resident[0]?.carplate}</Td>
                                            <Td>
                                                <Link href={'https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/' + registration.proof.Key} isExternal >
                                                    <Badge variant='outline' colorScheme='blue' bg='#EDF3FF' p={1} borderRadius={5}>
                                                        View
                                                    </Badge>
                                                </Link>
                                            </Td>
                                            <Td>
                                                <Badge variant='outline' colorScheme='yellow' bg='#FFEFD8' p={1} borderRadius={5} mr={2}>{registration.status}</Badge>
                                            </Td>
                                            <Td>
                                                <Button variant='outline' colorScheme='green' bg='#E9FFD8' p={1} borderRadius={5} onClick={() => handleApprove(registration.id)}>Approve</Button>
                                                {" OR "}
                                                <Button variant='outline' colorScheme='red' bg='#FBDADB' p={1} borderRadius={5} onClick={() => handleOpen(resident[0])}> Reject </Button>
                                            </Td>
                                        </Tr>


                                    );
                                }) :
                                <Tr>
                                    <Td colSpan={9}>No new residents application</Td>
                                </Tr>
                        }
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Name</Th>
                            <Th>IC no</Th>
                            <Th>Email Address</Th>
                            <Th>Phone number</Th>
                            <Th>Unit ID</Th>
                            <Th><Text width="300px">Address</Text></Th>
                            <Th><Text width="120px" whiteSpace="normal">Registered Car plate</Text></Th>
                            <Th><Text width="120px" whiteSpace="normal">Supporting Document</Text></Th>
                            <Th><Text width="100px" whiteSpace="normal">Approval Status</Text></Th>
                            <Th>Action</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
            {isOpen &&
                <Modal isOpen={isOpen}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Reject Registration</ModalHeader>
                        <ModalBody pb={6}>
                            <Text>Are you sure you want to delete this resident&apos;s registration? (The resident information will be permanently deleted from database.)</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={() => handleReject(selectedNew.account_id)}>
                                Delete
                            </Button>
                            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            }
        </>);
}

export default NewResidentTable;