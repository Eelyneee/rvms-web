import {
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Heading, Box, Badge, Link, FormControl, Input, IconButton, Flex, Text

} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';

import NewResidentTable from "./NewResidentTable";
import ExistingResidentTable from "./ExistingResidentTable";
import { useState, useRef } from "react";
import { supabaseClient } from "../lib/client";

const SearchBar = (props) => {
    const [term, setTerm] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        //  if (term != props.term) {
        //  setTerm(props.term)
        //   console.log("log" + props.term);
        //   }
        props.handleSubmit(term);
    }

    return (
        <FormControl mb={8}>
            <Flex justify='end'>
                <Input id='search' w={{ base: "100%", sm: "50%" }} bg='#EFEFEF' borderRadius='20' placeholder={props.placeholder}
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
                <IconButton aria-label='Search database' icon={<SearchIcon />} borderRadius='20' onClick={handleSubmit} />
            </Flex>
            <Text textAlign="right" mt="2" textColor="red">{props.valid}</Text>
        </FormControl>
    );

}

export default SearchBar;