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
    Button, Alert, AlertDescription, AlertTitle, AlertIcon, VStack

} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { signUpMT } from "../lib/function-db";
import { useRouter } from "next/router";

const AddAdminForm = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [ic, setIC] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [role, setRole] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    //validation
    const [nameVal, setNameValid] = useState("");
    const [icVal, setICValid] = useState("");
    const [emailVal, setEmailValid] = useState("");
    const [phoneVal, setPhoneValid] = useState("");
    const [roleVal, setRoleValid] = useState("");
    const [passName, setPassName] = useState(false);
    const [passIC, setPassIC] = useState(false);
    const [passEmail, setPassEmail] = useState(false);
    const [passPhone, setPassPhone] = useState(false);
    const [passRole, setPassRole] = useState(false);
    const [submit, setSubmit] = useState(0);

    // Add to DB
    const handleAdd = async () => {
        setSubmit(submit + 1);
        var nameReg = /^[a-zA-Z ,.'-]+$/
        var icReg = /^(([[0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01]))([0-9]{6})$/
        var emailReg = /^\S+@\S+\.\S+$/
        var phoneReg = /^(6?01){1}(([0145]{1}\d{7,8})|([236789]{1}\d{7}))$/
        var roleReg = /^[a-zA-Z\s]+$/


        if (name == "") {
            setPassName(false);
            setNameValid("Please enter name. ");
        } else if (nameReg.test(name) == false) {
            setPassName(false);
            setNameValid("Invalid name format. Please enter name in valid format.t");
        } else {
            setPassName(true);
        }

        if (ic == "") {
            setPassIC(false);
            setICValid("Please enter ic.");
        } else if (icReg.test(ic) == false) {
            setPassIC(false);
            setICValid("Invalid ic format. Please enter ic in valid format. ");
        } else {
            setPassIC(true);
        }

        if (email == "") {
            setPassEmail(false);
            setEmailValid("Please enter email. ");
        } else if (emailReg.test(email) == false) {
            setPassEmail(false);
            setEmailValid("Invalid email format. Please enter email in valid format. ");
        } else {
            setPassEmail(true);
        }

        if (phoneNo == "") {
            setPassPhone(false);
            setPhoneValid("Please enter phone number.");
        } else if (phoneReg.test(phoneNo) == false) {
            setPassPhone(false);
            setPhoneValid("Invalid phone format. Please enter phone number in valid format. \t");
        } else {
            setPassPhone(true);
        }

        if (role == "") {
            setPassRole(false);
            setRoleValid("Please enter role of the administrator. ");
        } else if (roleReg.test(role) == false) {
            setPassRole(false);
            setRoleValid("Invalid role format. Please enter role in valid format.");
        } else {
            setPassRole(true);
        }

        // when all pass is true then will load into db in useEffect

    }

    useEffect(() => {
        (async () => {
            if (passName == true && passIC == true && passEmail == true && passPhone == true && passRole == true) {
                let password = ic;
                let account_type = "management";
                const { data, error } = await signUpMT(name, ic, email, password, phoneNo, role, account_type);
                if (error) {
                    console.log(JSON.stringify(error));
                } else {
                    setShowAlert(true);
                }
            }
        })();
    }, [submit])

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        }
    }, [])

    return (<>
        <Box mx={[8, 8, 16]} my={8}>
            <Box mb={5}>
                <Link href="/administrators">{"< Back"}</Link>
            </Box>
            <Heading as='h2' size='lg' mb={8}> Add new administrator</Heading>
            {showAlert ? <Alert status='success'>
                <AlertIcon />
                <Box>
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                        New administrator information has been added.
                    </AlertDescription>
                </Box>
            </Alert> :
                <Box>
                    <FormControl >
                        <Box mb={4}>
                            <FormLabel htmlFor='name'>Name</FormLabel>
                            {!passName && <Text color="red" fontSize="xs" mb="2">{nameVal}</Text>}
                            <Input maxW={{ base: "100%", xl: "80%" }} id='name' placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
                            <FormHelperText>Eg: Kate Lim</FormHelperText>
                        </Box>
                        <Box mb={4}>
                            <FormLabel htmlFor='ic'>Identification No</FormLabel>
                            {!passIC && <Text color="red" fontSize="xs" mb="2">{icVal}</Text>}
                            <Input maxW={{ base: "100%", xl: "80%" }} id='ic' type='number' placeholder="Enter identification no" value={ic} onChange={(e) => setIC(e.target.value)} />
                            <FormHelperText>Eg: 000224016226</FormHelperText>
                        </Box>
                        <Box mb={4}>
                            <FormLabel htmlFor='email'>Email Address</FormLabel>
                            {!passEmail && <Text color="red" fontSize="xs" mb="2">{emailVal}</Text>}
                            <Input maxW={{ base: "100%", xl: "80%" }} id='email' type='email' placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <FormHelperText>Eg: kate@gmail.com</FormHelperText>
                        </Box>
                        <Box mb={4}>
                            <FormLabel htmlFor='phone'>Phone Number</FormLabel>
                            {!passPhone && <Text color="red" fontSize="xs" mb="2">{phoneVal}</Text>}
                            <Input maxW={{ base: "100%", xl: "80%" }} id='phone' type='number' placeholder="Enter phone number" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                            <FormHelperText>Eg: 60103627988</FormHelperText>
                        </Box>
                        <Box mb={4}>
                            <FormLabel htmlFor='role'>Role</FormLabel>
                            {!passRole && <Text color="red" fontSize="xs" mb="2">{roleVal}</Text>}
                            <Input maxW={{ base: "100%", xl: "80%" }} id='role' type='text' placeholder="Enter role" value={role} onChange={(e) => setRole(e.target.value)} />
                            <FormHelperText>Eg: staff</FormHelperText>
                        </Box>

                        <Button bg='blue' color='white' mt={4} onClick={handleAdd}>Add</Button>
                    </FormControl>
                </Box>
            }
        </Box>

    </>);
}

export default AddAdminForm;