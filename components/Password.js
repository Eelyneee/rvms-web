import { useState } from 'react';
import { InputGroup, Input, InputRightElement, Button, FormLabel } from '@chakra-ui/react';

const PasswordInput = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    return (
        <>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <InputGroup size='md'>
                <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='Enter password'
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </>
    )
}

export default PasswordInput;