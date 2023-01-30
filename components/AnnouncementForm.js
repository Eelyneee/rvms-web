import SideBarBox from "../components/SideBarBox";
import { Flex, Box, Heading, Button, Link, Avatar, FormControl, FormLabel, Input, Textarea, VStack, Text, Image, Alert, AlertIcon, AlertDescription, AlertTitle } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { saveDraftAnnouncement, savePublishedAnnouncement, getAdminstratorByID, listenForAdministratorChanges, updateDraftAnnouncement, publishDraftAnnouncement } from "../lib/function-db";
import { capitalizeFirstLetter } from "../lib/function";

const AnnouncementForm = ({ eID, eAdminID, eTitle, eDescription, eAdminName, eImage, edit }) => {

    const router = useRouter();
    let [title, setTitle] = useState('');
    let [description, setDescription] = useState('');
    let [e_title, setETitle] = useState(eTitle);
    let [e_description, setEDescription] = useState(eDescription);
    let [e_uploadFile, setEUploadFile] = useState(eImage);
    let [adminData, setAdminData] = useState([]);
    let [uploadFile, setUploadFile] = useState({});
    let [e_uploadChange, setEUploadChange] = useState(false);
    let [showAlert, setShowAlert] = useState(false);
    //check validation
    let [valMessage, setValMessage] = useState("");
    let [pass, setPass] = useState(false);
    let [valMessage2, setValMessage2] = useState("");
    let [pass2, setPass2] = useState(false);
    let [valMessage3, setValMessage3] = useState("");
    let [pass3, setPass3] = useState(false);
    let [valMessage4, setValMessage4] = useState("");
    let [pass4, setPass4] = useState(false);
    const [submit1, setSubmit1] = useState(0);
    const [submit2, setSubmit2] = useState(0);

    let admin_id = supabaseClient.auth.user()?.id;


    const updateDraftPost = async () => {
        if (e_uploadChange == true) {
            const { error } = await updateDraftAnnouncement(eID, e_title, e_description, e_uploadFile);
            if (error) {
                console.log("Error update draft announcement: " + error.message);
            }
            else {
                setShowAlert(true)
                setTimeout(() => {
                    router.push("/announcements");
                }, 3000);
            }
        } else {
            const { error } = await updateDraftAnnouncement(eID, e_title, e_description);
            if (error) {
                console.log("Error update draft announcement: " + error.message);
            }
            else {
                setShowAlert(true)
                setTimeout(() => {
                    router.push("/announcements");
                }, 3000);
            }
        }
    }

    const updatePublishPost = async () => {
        let status = "published";
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        if (e_uploadChange == true) {
            const { error } = await publishDraftAnnouncement(eID, e_title, e_description, status, date, time, uploadFile);
            if (error) {
                console.log("Error publish draft announcement: " + error.message);
            }
            else {
                setShowAlert(true)
                setTimeout(() => {
                    router.push("/announcements");
                }, 3000);
            }
        } else {
            const { error } = await publishDraftAnnouncement(eID, e_title, e_description, status, date, time);
            if (error) {
                console.log("Error publish draft announcement: " + error.message);
            }
            else {
                setShowAlert(true)
                setTimeout(() => {
                    router.push("/announcements");
                }, 3000);
            }
        }
    }

    const handleDraftSubmit = async () => {
        setSubmit1(submit1 + 1)
        if (title == "") {
            setPass(false);
            setValMessage("Please enter announcement title.");

        } else {
            setPass(true)
        }

        if (description == "") {
            setPass2(false);
            setValMessage2("Please enter announcement description.");
        } else {
            setPass2(true)
        }
        // will update pass, then use Effect to save announcement

    }

    // to save announcement to draft
    useEffect(() => {
        (async () => {
            if (pass == true && pass2 == true) {
                title = capitalizeFirstLetter(title);
                description = capitalizeFirstLetter(description);
                let status = "draft"
                const { error } = await saveDraftAnnouncement(title, description, admin_id, status, uploadFile);
                if (error) {
                    console.log("Error saving draft announcement: " + error.message);
                }
                else {
                    setShowAlert(true)
                    setTimeout(() => {
                        router.push("/announcements");
                    }, 3000);
                }
            }
        })();
    }, [submit1])

    const handlePublishSubmit = async () => {
        setSubmit2(submit2 + 1)
        if (title == "") {
            setPass3(false);
            setValMessage3("Please enter announcement title.");

        } else {
            setPass3(true)
        }

        if (description == "") {
            setPass4(false);
            setValMessage4("Please enter announcement description.");
        } else {
            setPass4(true)
        }
        // will update pass, then use Effect to save announcement

    }

    useEffect(() => {
        (async () => {
            if (pass3 == true && pass4 == true) {
                title = capitalizeFirstLetter(title);
                description = capitalizeFirstLetter(description);
                let status = "published";
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                console.log("i am clicked")
                const { error } = await savePublishedAnnouncement(title, description, admin_id, status, date, time, uploadFile);
                if (error) {
                    console.log("Error saving publish announcement: " + error.message);
                }
                else {
                    setShowAlert(true)
                    setTimeout(() => {
                        router.push("/announcements");
                    }, 3000);
                }

            }
        })();
    }, [submit2])

    const loadAdministrator = async () => {
        if (eAdminID != null && edit == 1) {
            const { administrator, error } = await getAdminstratorByID(eAdminID);
            setAdminData(administrator);
        } else {
            const { administrator, error } = await getAdminstratorByID(admin_id);
            setAdminData(administrator);
        }
    }

    const handleUpload = (e) => {
        let file;

        if (e.target.files) {
            file = e.target.files[0];
        }

        if (edit == 1) {
            setEUploadFile(file)
            setEUploadChange(true)
        } else {
            setUploadFile(file)
        }

    }

    useEffect(() => {
        if (!supabaseClient.auth.user()) {
            router.push('/signin');
        } else {
            loadAdministrator();

        }
    }, []);

    useEffect(() => {
        listenForAdministratorChanges(loadAdministrator);
    }, [])


    return (
        <>
            <Box mx={[4, 8, 16]} my={8}>
                <Heading as='h2' size='lg' mb={8}>Announcement</Heading>
                {edit == 1 ?
                    <Heading as='h3' size='md' mb={4}>Edit Announcement</Heading> :
                    <Heading as='h3' size='md' mb={4}>New Announcement</Heading>
                }
                {showAlert ?
                    <Alert status='success'>
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                {edit == 1 ? "Announcement is updated." : "Announcement is saved."}
                            </AlertDescription>
                        </Box>
                    </Alert> :
                    <FormControl >
                        <Box mb={4}>
                            <FormLabel htmlFor='name' mb={0}>Published by:</FormLabel>
                            {adminData != null ? <Text fontSize={"sm"}>{adminData.name} </Text>
                                : <>Admin name not found</>
                            }
                        </Box>
                        <Box mb={4}>
                            <FormLabel htmlFor='title'>Title</FormLabel>
                            {!pass && <Text color="red" fontSize="xs" mb="2">{valMessage}</Text>}
                            {!pass3 && <Text color="red" fontSize="xs" mb="2">{valMessage3}</Text>}
                            {edit == 1 ?
                                <Input maxW={{ base: "100%", xl: "80%" }} id='title' placeholder="" value={e_title} onChange={(e) => setETitle(e.target.value)} /> :
                                <Input maxW={{ base: "100%", xl: "80%" }} id='title' placeholder="Enter announcement's title" value={title} onChange={(e) => setTitle(e.target.value)} />
                            }
                        </Box>
                        <Box mb={4}>
                            <FormLabel htmlFor='description'>Description</FormLabel>
                            {!pass2 && <Text color="red" fontSize="xs" mb="2">{valMessage2}</Text>}
                            {!pass4 && <Text color="red" fontSize="xs" mb="2">{valMessage4}</Text>}
                            {
                                edit == 1 ?
                                    <Textarea
                                        maxW={{ base: "100%", xl: "80%" }}
                                        value={e_description} onChange={(e) => setEDescription(e.target.value)}
                                        placeholder='Enter description'
                                        size='lg'
                                    /> : <Textarea height="350px"
                                        maxW={{ base: "100%", xl: "80%" }}
                                        value={description} onChange={(e) => setDescription(e.target.value)}
                                        placeholder='Enter description'
                                        size='lg'
                                    />
                            }

                        </Box>

                        {edit == 1 ? <Box mb={16} >
                            <FormLabel htmlFor='announcement'>Upload new image</FormLabel>
                            <Input maxW={{ base: "100%", xl: "80%" }} id='announcement.img' accept="image/" type='file' textColor="gray.900" borderRadius="2xl" bg="gray.50" textAlign='center'
                                onChange={(e) => { handleUpload(e); }}
                            />
                            {!e_uploadChange & e_uploadFile == null ?
                                <Image src='https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/announcement.img/fallback' alt='e_uploadFile.Key' width="350px" height="120px"
                                    objectFit='cover'
                                /> : <></>
                            }
                            {!e_uploadChange & e_uploadFile != null ?
                                <Image src={'https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/' + e_uploadFile.Key} alt='e_uploadFile.Key' boxSize='350px'
                                    objectFit='cover'
                                    fallbackSrc='https://ldfotgflxcncnaameeig.supabase.co/storage/v1/object/public/announcement.img/fallback' /> : <></>
                            }

                        </Box>
                            :
                            <Box mb={16} >
                                <FormLabel htmlFor='announcement'>Upload image</FormLabel>
                                <Input maxW={{ base: "100%", xl: "80%" }} id='announcement.img' accept="image/" type='file' textColor="gray.900" borderRadius="2xl" bg="gray.50" textAlign='center'
                                    onChange={(e) => { handleUpload(e); }}
                                />
                            </Box>

                        }
                        {
                            edit == 1 ?
                                <Flex flexDir='column' justify='center' align='end' >
                                    <Button bg='blue' color='white' mt={4} type="submit" onClick={updateDraftPost}>Update as draft</Button>
                                    <Button bg='blue' color='white' mt={4} type="submit" onClick={updatePublishPost}>Save and Publish</Button>
                                </Flex>
                                : <Flex flexDir='column' justify='center' align='end' >
                                    <Button bg='blue' color='white' mt={4} type="submit" onClick={handleDraftSubmit}>Save as draft</Button>
                                    <Button bg='blue' color='white' mt={4} type="submit" onClick={handlePublishSubmit}>Save and Publish</Button>
                                </Flex>
                        }
                    </FormControl>
                }
            </Box>

        </>)

}

export default AnnouncementForm;

