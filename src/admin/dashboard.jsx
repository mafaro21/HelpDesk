import React from 'react'
import Navbar from './navbar';
import { Box, Center, Container, HStack } from '@chakra-ui/react';

export default function Dashboard() {
    return (
        <>
            <Navbar />
            <Box bg={'black'} color={'white'} minH={'92.1vh'}>
                <Container maxW={'5xl'} pt={10}>
                    <Center>
                        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="90px" marginTop="28px">
                            <Box bg="tomato" borderRadius={'12px'} p={9}>General Requests</Box>
                            <Box bg="brown" borderRadius={'12px'} p={9}>Hardware Requests</Box>
                            <Box bg="brown" borderRadius={'12px'} p={9}>Email Requests</Box>
                            <Box bg="blue" borderRadius={'12px'} p={9}>Transfer Requests</Box>
                        </Box>
                    </Center>
                </Container>

            </Box>
        </>
    )
}
