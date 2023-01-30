import { Alert, AlertIcon, Box, Button, chakra, FormControl, FormLabel, Heading, Input, Stack, Text, } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { supabaseClient } from "../lib/client";
import { signIn } from "../lib/function-db";
import { useEffect } from "react";
import Header from "../components/Header";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    //validation
    const [passEmail, setPassEmail] = useState(false);
    const [passPassword, setPassPassword] = useState(false);
    const [valEmail, setValEmail] = useState("");
    const [valPassword, setValPassword] = useState("");
    const [submit, setSubmit] = useState(0);

    const router = useRouter();

    const submitHandler = async (event) => {
        event.preventDefault();
        setSubmit(submit + 1);
        var emailReg = /^\S+@\S+\.\S+$/
        var passwordReg = /^[a-zA-Z0-9@#._-]{8,}$/

        if (email == "") {
            setPassEmail(false);
            setValEmail("Please enter email. ");
        } else if (emailReg.test(email) == false) {
            setPassEmail(false);
            setValEmail("Invalid email format. Please enter email in valid format. ");
        } else {
            setPassEmail(true);
        }

        if (password == "") {
            setPassPassword(false);
            setValPassword("Please enter password. ");
        } else if (passwordReg.test(password) == false) {
            setPassPassword(false);
            setValPassword("Invalid password format. Please enter password in valid format. ");
        } else {
            setPassPassword(true);
        }


    };

    useEffect(() => {
        (async () => {
            if (passEmail == true & passPassword == true) {
                setIsLoading(true);
                setError(null);
                try {
                    const { error } = await signIn(email, password);
                    if (error) {
                        setError(error.message);
                    } else {
                        router.push("/");
                    }
                } catch (error) {
                    setError(error.message);
                } finally {
                    setIsLoading(false);
                }
            }
        })();
    }, [submit])

    return (
        <Box>
            <Header slug="Sign in" />
            <Box minH="100vh" py="12" px={{ base: "4", lg: "8" }} bg="gray.50">
                <Box maxW="md" mx="auto">
                    <Heading textAlign="center" m="6">
                        Welcome to Resident & Visitor Management System
                    </Heading>
                    {error && (
                        <Alert status="error" mb="6">
                            <AlertIcon />
                            <Text textAlign="center">{error}</Text>
                        </Alert>
                    )}
                    <Box
                        py="8"
                        px={{ base: "4", md: "10" }}
                        shadow="base"
                        rounded={{ sm: "lg" }}
                        bg="white"
                    >
                        <chakra.form onSubmit={submitHandler}>
                            <Stack spacing="6">
                                <FormControl id="email">
                                    <FormLabel>Email address</FormLabel>
                                    {!passEmail && <Text color="red" fontSize="xs" mb="2">{valEmail}</Text>}
                                    <Input
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                        }}
                                    />
                                </FormControl>
                                <FormControl id="password">
                                    <FormLabel>Password</FormLabel>
                                    {!passPassword && <Text color="red" fontSize="xs" mb="2">{valPassword}</Text>}
                                    <Input
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                        }}
                                    />
                                </FormControl>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    size="lg"
                                    fontSize="md"
                                    isLoading={isLoading}
                                >
                                    Sign in
                                </Button>
                            </Stack>
                        </chakra.form>
                        <Text fontSize='xs' align="center">(For First-time log-in user, your password is your identification number.)</Text>
                        <Text fontSize='xs' align="center">Remember to change your password after first-time login.</Text>
                        <Text fontSize='xs' align="center">** Password must be more than 8 numbers/letters. (Special case like ._-@# are allowed to use.)</Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Auth;