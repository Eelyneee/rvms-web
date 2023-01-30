import { Tag, TagLabel, TagLeftIcon, Wrap, WrapItem } from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons'
import { BsFillCircleFill } from "react-icons/bs";

const FeedbackCategories = () => {
    return (
        <>
            <Wrap spacing={["10px", "20px"]}>
                <WrapItem>
                    <Tag size='md' color='#ea580c' bg='#ffebd4' mr={4}>
                        <TagLeftIcon as={BsFillCircleFill} />
                        <TagLabel>Technical Support</TagLabel>
                    </Tag>
                </WrapItem>
                <WrapItem>
                    <Tag size='md' color='#0d9488' bg='#dcfff8' mr={4}>
                        <TagLeftIcon as={BsFillCircleFill} />
                        <TagLabel>Billing Support</TagLabel>
                    </Tag>
                </WrapItem>
                <WrapItem>
                    <Tag size='md' color='#7f1d1d' bg='#ffdede' mr={4}>
                        <TagLeftIcon as={BsFillCircleFill} />
                        <TagLabel>Security Issue</TagLabel>
                    </Tag>
                </WrapItem>
                <WrapItem>
                    <Tag size='md' color='#65a30d' bg='#edfbd3' mr={4}>
                        <TagLeftIcon as={BsFillCircleFill} />
                        <TagLabel>Car Park Issue</TagLabel>
                    </Tag>
                </WrapItem>
                <WrapItem>
                    <Tag size='md' color='#312e81' bg='#e0e5fa' mr={4}>
                        <TagLeftIcon as={BsFillCircleFill} />
                        <TagLabel>Defect of Common Area</TagLabel>
                    </Tag>
                </WrapItem>
                <WrapItem>
                    <Tag size='md' color='#701a75' bg='#f9e3ff' mr={4}>
                        <TagLeftIcon as={BsFillCircleFill} />
                        <TagLabel>Suggestion</TagLabel>
                    </Tag>
                </WrapItem>
                <WrapItem>
                    <Tag size='md' color='#808080' bg='#e9eff7' mr={4}>
                        <TagLeftIcon as={BsFillCircleFill} />
                        <TagLabel>Others</TagLabel>
                    </Tag>
                </WrapItem>
            </Wrap>
        </>
    );
}

export default FeedbackCategories;

