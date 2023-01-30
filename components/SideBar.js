import {
    Flex,
    Image,
    Text,
    Link,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import { useRouter } from 'next/router';


const SideBar = (props) => {

    var path; const router = useRouter();
    useEffect(() => {
        path = router.pathname;

        console.log('chech path:' + path)
    }, [])

    return (
        <>
            {path == props.href ?
                <Link color='teal.500' href={props.href} px={4} backgroundColor={'red'}>
                    <Flex px={4} py={2} align='center' fontWeight='bold' color='#000'>
                        <Image
                            boxSize='30px'
                            objectFit='cover'
                            src={props.src}
                            alt='props.src'
                        />
                        <Text fontSize='sm' ml={4}>{props.name}</Text>
                        <Text fontSize='sm' ml={4}>{props.name}</Text>
                    </Flex>
                </Link>
                : <Link color='teal.500' href={props.href} px={4}>
                    <Flex px={4} py={2} align='center' fontWeight='bold' color='#797979'>
                        <Image
                            boxSize='30px'
                            objectFit='cover'
                            src={props.src}
                            alt='props.src'
                        />
                        <Text fontSize='sm' ml={4}>{props.name}</Text>
                    </Flex>
                </Link>
            }
        </>)

}

export default SideBar;

