import {
    Flex,
    Image,
    Text,
    Link,
    Heading,
    Avatar,
    Box,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button, InputGroup, InputRightElement, Circle, Icon, VStack, HStack, Alert, AlertIcon, AlertTitle, AlertDescription,

} from "@chakra-ui/react";
import PasswordInput from "./Password";
import { useState, useRef, useEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { supabaseClient } from "../lib/client"
import { getAdminstratorByID, listenForAdministratorChanges, resetPassword, updateProfileImage } from "../lib/function-db";
import { useRouter } from "next/router";

const Profile = () => {

    const router = useRouter();
    const [show, setShow] = useState(false);
    const [editP, setEditP] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [updated2, setUpdated2] = useState(false);
    const [password, setPassword] = useState("");
    const [adminData, setAdminData] = useState([]);
    const [eImage, setEImage] = useState({});
    const [valMessage, setValMessage] = useState("");
    const [pass, setPass] = useState(false);

    let [e_uploadChange, setEUploadChange] = useState(false);
    let admin_id = supabaseClient.auth.user()?.id;

    const handleShow = () => setShow(!show);
    const handleEditP = () => {
        setEditP(!editP);
        console.log("press")
    }

    const handleUpload = (e) => {
        let file;

        if (e.target.files) {
            file = e.target.files[0];
        }

        setEImage(file);
        setEUploadChange(true);

    }

    const handleUpdate = async () => {
        if (e_uploadChange == true) {
            const { error } = await updateProfileImage(eImage, admin_id);
            if (!error) {
                setUpdated2(true);
                setTimeout(() => {
                    setUpdated2(false);
                }, 3000);
            }
        }

        // need more validation
        var passwordReg = /^[a-zA-Z0-9@#._-]{8,}$/
        if (password != "") {
            if (passwordReg.test(password) == true) {
                setPass(true);
                const { error } = await resetPassword(password, admin_id);
                if (!error) {
                    console.log("changed password")
                    setUpdated(true);
                    setTimeout(() => {
                        setUpdated(false);
                    }, 3000);
                    setPassword("");
                } else {
                    console.log("error: " + error.message)
                }
            } else {
                setPass(false);
                setValMessage("Please enter the correct format of password.")
            }
        }
    }

    const loadAdminstrator = async () => {
        const { administrator, error } = await getAdminstratorByID(admin_id);
        if (!error) {
            setAdminData(administrator);
            console.log(administrator)
        }
    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadAdminstrator();
            listenForAdministratorChanges(loadAdminstrator);
        }
    }, [updated, updated2])

    return (<>
        <Box mx={[8, 8, 16]} my={[4, 4, 8]}>
            <Heading as='h2' size='lg' mb={8}> Edit your profile</Heading>
            <FormControl >
                {
                    updated2 ? <Alert status='success' mb={4}>
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                Your profile image is successfully changed.
                            </AlertDescription>
                        </Box>
                    </Alert> : <></>
                }
                <Flex mb={4} align='center' >
                    {
                        adminData.images == null ?
                            <Avatar name={adminData.name} src={''} alt="adminData.name" />
                            :
                            <Avatar name={adminData.name} src={'https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/' + adminData?.images?.Key} alt="adminData.images.Key" />
                    }
                    <Box ml={5}>
                        <Circle bg='blue' color='#fff' p={2} onClick={handleEditP}>
                            <Icon as={BiEdit} />
                            <Text fontSize="xs" ml="3">Upload new image</Text>
                        </Circle>
                    </Box>
                    {
                        editP &&
                        <Box ml={5}>
                            <FormLabel htmlFor='avatar'>Upload your image</FormLabel>
                            <Input id='profile.img' accept="image/" type='file' textColor="gray.900" borderRadius="2xl" bg="gray.50" textAlign='center'
                                onChange={(e) => { handleUpload(e); }}
                            />
                        </Box>
                    }
                </Flex>
                {
                    updated ? <Alert status='success' mb={4}>
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                Your password is successfully changed.
                            </AlertDescription>
                        </Box>
                    </Alert> : <></>
                }

                <Box mb={4} borderWidth={1} borderColor='#000' borderRadius={5} py={2} px={4} maxW="450px">
                    <Text fontSize="lg" fontWeight="bold">Name</Text>
                    <Text fontSize="md">{adminData.name}</Text>
                </Box>
                <Box mb={4} borderWidth={1} borderColor='#000' borderRadius={5} py={2} px={4} maxW="450px" >
                    <Text fontSize="lg" fontWeight="bold">Identification No.</Text>
                    <Text fontSize="md">{adminData.ic}</Text>
                </Box>
                <Box mb={4} borderWidth={1} borderColor='#000' borderRadius={5} py={2} px={4} maxW="450px">
                    <Text fontSize="lg" fontWeight="bold">Email Address</Text>
                    <Text fontSize="md">{adminData.accounts?.email}</Text>
                </Box>
                <Box mb={4} borderWidth={1} borderColor='#000' borderRadius={5} py={2} px={4} maxW="450px">
                    <Text fontSize="lg" fontWeight="bold">Phone Number</Text>
                    <Text fontSize="md">{adminData.phone_no}</Text>
                </Box>
                <Box mb={4} borderWidth={1} borderColor='#000' borderRadius={5} py={2} px={4} maxW="450px">
                    <Text fontSize="lg" fontWeight="bold">Role</Text>
                    <Text fontSize="md">{adminData.role}</Text>
                </Box>
                <Box mb={4} borderWidth={1} borderColor='#000' borderRadius={5} py={2} px={4} maxW="450px">
                    <HStack justifyContent="space-between" alignItems="start">
                        <FormLabel htmlFor='password' mb={4}>Edit Password</FormLabel>
                    </HStack>
                    {!pass && <Text color="red" fontSize="xs">{valMessage}</Text>}
                    <VStack>
                        <Text fontSize="sm">New Password: </Text>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleShow}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </VStack>
                    <FormHelperText>** Password must be more than 8 numbers/letters. (Special case like ._-@# are allowed to use.)</FormHelperText>
                </Box>
                <Button bg='blue' color='white' mt={4} px={20} onClick={handleUpdate}>Update</Button>
                <Box display={{ base: "box", lg: "none" }}>
                    <Button bg='blue' color='#fff' px='20' mt="4" onClick={() => supabaseClient.auth.signOut()}> Log out</Button>
                </Box>

            </FormControl>
        </Box>

    </>);
}

export default Profile;