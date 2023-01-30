import { useState, useEffect } from "react";
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
    Button, InputGroup, InputRightElement, Circle, Icon, HStack, Alert, AlertIcon, AlertTitle, AlertDescription,

} from "@chakra-ui/react";


const InfoCard = ({ bgColor, color, icon, amount, title }) => {
    return (
        <HStack p={4} boxShadow='md' rounded='md' bg='white' maxW="320px">
            <Circle bg={bgColor} color={color} p={2}>
                <Icon as={icon} />
            </Circle>
            <Box>
                <Text fontSize="md" fontWeight="bold">{amount}</Text>
                <Text fontSize="xs">{title}</Text>
            </Box>
        </HStack>
    );
}

export default InfoCard;