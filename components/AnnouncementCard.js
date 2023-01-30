import {
    Flex,
    Image,
    Text,
    Link,
    Heading,
    Avatar,
    Box, Circle, Center,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button, Icon, Container, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter

} from "@chakra-ui/react";
import NextLink from "next/link"
import { BiEdit, BiTrash, BiShow } from "react-icons/bi";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client"
import { removeAnnouncement } from "../lib/function-db";

const AnnouncementCard = ({ id, name, title, description, edit, date, time }) => {
    const [isOpen, setIsOpen] = useState(false);


    const handleDeleteAnnouncement = async () => {
        const { error } = await removeAnnouncement(id);
        if (error) {
            console.log("Error Deleting Announcement, " + error.message);
        }
        setIsOpen(false);
    }

    return (<>
        <Box pos='relative' my="10">
            <Box p={4} borderWidth={1} borderColor='#e3e3e3' borderRadius={10} bg='#EDF4FF' mb={5} boxShadow='xl'>
                {/* <Text>ID: ann_992e</Text> */}
                <Text fontSize="xs">Published by: {name}</Text>
                <Heading as='h3' size='md' textDecoration='underline' mt={4}>{title}</Heading>
                <Text size='xxs'>{description}</Text>
                {edit == false ? <Text fontSize="xs" mt="4">{date + " " + time}</Text> : <></>}
            </Box>
            <Flex pos='absolute' top={1} right={1}>
                <Center>
                    {edit == true ?
                        <NextLink href={{ pathname: "/announcement-edit", query: { id: id } }} passHref>
                            <Link mr={1}>
                                <Circle bg='blue' color='#fff' p={2}>
                                    <Icon as={BiEdit} />
                                </Circle>
                            </Link>
                        </NextLink> :
                        <NextLink href={{ pathname: "/announcement-view", query: { id: id } }} passHref>
                            <Link mr={1}>
                                <Circle bg='blue' color='#fff' p={2}>
                                    <Icon as={BiShow} />
                                </Circle>
                            </Link>
                        </NextLink>
                    }
                </Center>

                {/*should be direct handle remove */}
                <Button m={0} p={0} onClick={() => setIsOpen(true)}>
                    <Circle bg='blue' color='#fff' p={2}>
                        <Icon as={BiTrash} />
                    </Circle>
                </Button>

                {isOpen &&
                    <Modal isOpen={isOpen}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Delete Announcement</ModalHeader>
                            <ModalBody pb={6}>
                                <Text>Are you sure you want to delete this announcement?</Text>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='red' mr={3} onClick={handleDeleteAnnouncement}>
                                    Delete
                                </Button>
                                <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                }
            </Flex>
        </Box>
    </>);
}

export default AnnouncementCard;