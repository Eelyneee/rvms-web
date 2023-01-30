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
import { supabaseClient } from "../lib/client"
import { createClient } from "@supabase/supabase-js";
import { getApprovedResidentRegistration, getAllResident, getResidentAccountData, getHouseUnit, listenForResident, listenForRegistration, listenForAccountChanges, getResidentsByUnitID, deleteResident } from "../lib/function-db";

import SearchBar from "./SearchBar";
import { useRouter } from "next/router";

const ExistingResidentTable = ({ tab }) => {
    const router = useRouter();
    const [registrationData, setRegistrationData] = useState([]);
    const [residentData, setResidentData] = useState([]);
    const [accountData, setAccountData] = useState([]);
    const [unitData, setUnitData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResident, setSearchResident] = useState([]);
    const [search, setSearch] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [removeAlert, setRemoveAlert] = useState(false);
    const [validation, setValidation] = useState("");
    const [invalid, setInvalid] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState({});


    const handleRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }

    const handleViewAll = () => {
        setSearchResident([]);
        setSearchTerm("");
        setSearch(false);
    }

    const handleOpen = (resident) => {
        setIsOpen(true);
        setSelectedResident(resident);
    }


    const handleDelete = async (id) => {
        if (search == true && searchResident.length != 0) {
            setSearchResident([]);
            setSearchTerm("");
            setSearch(false);
        }
        const { error } = await deleteResident(id);
        if (!error) {
            setIsOpen(false);
            setRemoveAlert(true);
            setTimeout(() => {
                setRemoveAlert(false);
            }, 3000);
        }
    }

    const onTermSubmit = async (term) => {
        console.log("clicked term:" + term);
        var regex = /^[0-9]*$/;
        if (regex.test(term) == true) {
            setSearchTerm(term);
            setSearch(true);
            const { residents, error } = await getResidentsByUnitID(term)
            console.log(residents);
            if (!error) {
                setSearchResident(residents);
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

    const loadAllRegistration = async () => {
        const { residents_registration, error } = await getApprovedResidentRegistration();
        setRegistrationData(residents_registration);
        console.log(error);
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
    }, [tab, refresh]);

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
            <SearchBar placeholder={"Enter unit no to search"} handleSubmit={onTermSubmit} valid={validation} />
            <Button size={{ base: "sm", md: "md" }} colorScheme='blue' variant='outline' mb={[4, 4, 8]} onClick={handleRefresh}>Refresh</Button>
            {
                searchResident.length != 0 ? <Box><Button bg="blue" size={{ base: "sm", md: "md" }} color="white" mb={[4, 4, 8]} onClick={handleViewAll}>View All</Button></Box> : <></>
            }
            {
                searchResident.length == 0 && search == true ? <Text>{invalid}</Text> : <></>
            }
            {removeAlert ?
                <Alert status='success' mb={3}>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                            This resident&apos;s information is deleted from database.
                        </AlertDescription>
                    </Box>
                </Alert> : <></>}
            <TableContainer>
                <Table variant='simple'>
                    <Thead bg='#D7E5FF'>
                        <Tr>
                            <Th><Text>Name</Text></Th>
                            <Th><Text>IC no</Text></Th>
                            <Th><Text>Email Address</Text></Th>
                            <Th><Text>Phone number</Text></Th>
                            <Th><Text>Unit ID</Text></Th>
                            <Th><Text width="300px">Address</Text></Th>
                            <Th><Text width="120px" whiteSpace="normal">Registered Car plate</Text></Th>
                            <Th><Text width="120px" whiteSpace="normal">Supporting Document</Text></Th>
                            <Th><Text width="100px" whiteSpace="normal">Approval Status</Text></Th>
                            <Th><Text>Remove</Text></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            searchTerm != "" && searchResident.length != 0 ?
                                searchResident.map((search) => {
                                    const unit = unitData.filter((unit) => { return search.unit_id == unit.unit_id })
                                    return (
                                        <Tr key={search.account_id}>
                                            <Td >{search.name}</Td>
                                            <Td>{search.ic}</Td>
                                            <Td>{search.accounts.email}</Td>
                                            <Td>{search.phone_no}</Td>
                                            <Td>{search.unit_id}</Td>
                                            <Td whiteSpace="normal">{unit[0]?.address}</Td>
                                            <Td>{search.carplate}</Td>
                                            <Td>
                                                <Link href={'https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/' + search.residents_registration?.proof?.Key} isExternal >
                                                    <Badge variant='outline' colorScheme='blue' bg='#EDF3FF' p={1} borderRadius={5}>
                                                        View
                                                    </Badge>
                                                </Link>
                                            </Td>
                                            <Td>
                                                <Badge variant='outline' colorScheme='green' bg='#E9FFD8' p={1} borderRadius={5} mr={2}>Approved</Badge>
                                            </Td>
                                            <Td><Button colorScheme='red' variant='outline' bg="#FBDADB" p={1} textTransform='uppercase' height='auto' fontSize='sm' fontWeight='bold' onClick={() => handleOpen(search)} >Remove</Button></Td>
                                        </Tr>
                                    );

                                })
                                :
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
                                            <Td whiteSpace="normal"><Text >{unit[0]?.address}</Text></Td>
                                            <Td>{resident[0]?.carplate}</Td>
                                            <Td>
                                                <Link href={'https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/' + registration.proof.Key} isExternal >
                                                    <Badge variant='outline' colorScheme='blue' bg='#EDF3FF' p={1} borderRadius={5}>
                                                        View
                                                    </Badge>
                                                </Link>
                                            </Td>
                                            <Td>
                                                <Badge variant='outline' colorScheme='green' bg='#E9FFD8' p={1} borderRadius={5} mr={2}>Approved</Badge>
                                            </Td>
                                            <Td><Button colorScheme='red' variant='outline' bg="#FBDADB" p={1} textTransform='uppercase' height='auto' fontSize='sm' fontWeight='bold' onClick={() => handleOpen(resident[0])} >Remove</Button></Td>
                                        </Tr>

                                    );
                                })
                        }
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th><Text>Name</Text></Th>
                            <Th><Text>IC no</Text></Th>
                            <Th><Text>Email Address</Text></Th>
                            <Th><Text>Phone number</Text></Th>
                            <Th><Text>Unit ID</Text></Th>
                            <Th><Text width="300px">Address</Text></Th>
                            <Th><Text width="120px" whiteSpace="normal">Registered Car plate</Text></Th>
                            <Th><Text width="120px" whiteSpace="normal">Supporting Document</Text></Th>
                            <Th><Text width="100px" whiteSpace="normal">Approval Status</Text></Th>
                            <Th><Text>Remove</Text></Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
            {isOpen &&
                <Modal isOpen={isOpen}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Delete Resident</ModalHeader>
                        <ModalBody pb={6}>
                            <Text>Are you sure you want to delete this resident. (The resident information will be permanently deleted from database.)</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={() => handleDelete(selectedResident.account_id)}>
                                Delete
                            </Button>
                            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            }
        </>);
}

export default ExistingResidentTable;