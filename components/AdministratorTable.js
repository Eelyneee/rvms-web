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
    Heading, Box, Badge, Link, Button, Alert, AlertIcon, AlertTitle, AlertDescription, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text

} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { createClient } from "@supabase/supabase-js";
import { getAllAdministrator, getManagementAccountData, listenForAdministratorChanges, listenForAccountChanges, deleteMT, getAdminstratorByID, removeAnnouncement } from "../lib/function-db";
import { useRouter } from "next/router";

const AdministratorTable = () => {
    const router = useRouter();
    let admin_id = supabaseClient.auth.user()?.id;
    let [currentAdminData, setCurrentAdminData] = useState([]);
    const [administratorData, setAdministratorData] = useState([])
    const [accountData, setAccountData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [removeAlert, setRemoveAlert] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState({});

    const handleRefresh = () => {
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }

    const handleOpen = (admin) => {
        setIsOpen(true);
        setSelectedAdmin(admin);
    }

    const handleDelete = async (id) => {
        const { error } = await deleteMT(id);
        if (error) {
            console.log("Error deleting administrators, " + error.message);
        } else {
            setIsOpen(false);
            setRemoveAlert(true)
            setTimeout(() => {
                setRemoveAlert(false);
            }, 3000);
        }
    }

    const loadCurrentAccount = async () => {
        const { administrator, error } = await getAdminstratorByID(admin_id);
        setCurrentAdminData(administrator);
    }

    const loadAllAdministrator = async () => {
        const { administrators, error } = await getAllAdministrator();
        setAdministratorData(administrators);
    }

    const loadAccount = async () => {
        const { accounts, error } = await getManagementAccountData();
        setAccountData(accounts);
        console.log(error);
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadAllAdministrator();
            loadAccount();
            loadCurrentAccount();

        }
    }, [refresh]);

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            const client = createClient("https://ldfotgflxcncnaameeig.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZm90Z2ZseGNuY25hYW1lZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ0ODcyMzEsImV4cCI6MTk3MDA2MzIzMX0.ahVip8dq6j2Pmyso84QAYeM10dsYmhF1zEiSYtnE8kc")
            const subscription = client
                .from('administrators')
                .on('*', payload => {
                    console.log('Change received!', payload)
                    loadAllAdministrator();
                    loadAccount();
                    loadCurrentAccount();
                })
                .subscribe()
            return () => {
                subscription.unsubscribe()
            }
        }
    }, [])

    return (
        <>
            <Box>
                <Button size={{ base: "sm", md: "md" }} colorScheme='blue' variant='outline' mb={[4, 4, 8]} onClick={handleRefresh}>Refresh</Button>
            </Box>
            {
                removeAlert ? <Alert status='success' mb="4">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                            The administrator information is deleted from database.
                        </AlertDescription>
                    </Box>
                </Alert> : <></>
            }
            <TableContainer>
                <Table variant='simple'>
                    <Thead bg='#DDF3E1'>
                        <Tr>
                            <Th>Name</Th>
                            <Th>IC no</Th>
                            <Th>Phone number</Th>
                            <Th>Email Address</Th>
                            <Th>Role</Th>
                            {currentAdminData.length != 0 && currentAdminData.role != 'staff' ? <Th>Remove</Th> : <></>}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            administratorData.map((admin) => {
                                const account = accountData.filter((account) => { return admin.account_id == account.id });
                                return (
                                    <Tr key={admin.account_id}>
                                        <Td>{admin.name}</Td>
                                        <Td>{admin.ic}</Td>
                                        <Td>{admin.phone_no}</Td>
                                        <Td>{account[0]?.email}</Td>
                                        <Td>{admin.role}</Td>
                                        {currentAdminData.length != 0 && currentAdminData.role != 'staff' ?
                                            <Td><Button colorScheme='red' variant='outline' bg="#FBDADB" p={1} textTransform='uppercase' height='auto' fontSize='sm' fontWeight='bold'
                                                onClick={() => handleOpen(admin)}>Remove</Button></Td>
                                            : <></>}
                                    </Tr>

                                );
                            })
                        }


                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Name</Th>
                            <Th>IC no</Th>
                            <Th>Phone number</Th>
                            <Th>Email Address</Th>
                            <Th>Role</Th>
                            {currentAdminData.length != 0 && currentAdminData.role != 'staff' ? <Th>Remove</Th> : <></>}
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
            {isOpen &&
                <Modal isOpen={isOpen}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Delete Admin</ModalHeader>
                        <ModalBody pb={6}>
                            <Text>Are you sure you want to delete this administrators?</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={() => handleDelete(selectedAdmin.account_id)}>
                                Delete
                            </Button>
                            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            }
        </>);
}

export default AdministratorTable;