import React, { useEffect, useState } from 'react'
// import Navbar from '../components/Navbar'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  CheckboxGroup,
  Checkbox,
  Textarea,
  Button,
  Input,
  Heading,
  Box,
  VStack,
  HStack,
  Container,
  Text,
  Flex,
  Center,
  Divider,
  Alert,
  AlertIcon,
  Image
} from '@chakra-ui/react';
import Hardware from './components/hardware';
import Email from './components/email';
import General from './components/general';
import Transfer from './components/transfer';
import FAQs from './components/FAQs';
import PHC from './img/PHC_Logo.png'
import axios from 'axios'

export default function Requisition() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [showPage, setShowPage] = useState('general')

  let x = 'green'

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }

    axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: location.latitude,
        lon: location.longitude,
        format: 'json',
      },
    })
      .then((res) => {
        console.log(res.data.display_name)
      })
      .catch((err) => {
        console.log(err)
      })

  };

  // getLocation()

  return (
    <>
      {/* <Navbar /> */}
      <Container maxW='1100px' pt='4' >
        <Box>
          <Center>
            <Image
              src={PHC}
              alt="Company Logo"
              boxSize="100px" // Adjust the size as needed
              objectFit="contain"
            /></Center>
          <Center fontSize={'3xl'}>IT Help Desk</Center>

          {/* <Alert mt={3} variant={'solid'} >
            <AlertIcon />
            Please note that the entire department is not currently at head office, you can still send your request and we will attend to it when we are back.
            The department is aware of the current network challenges and we are attending to it, there is no need to send a request.

          </Alert> */}

          <Flex mt='5' h='7'  >

            <Center
              // style={{ width: '50%', borderRight: '2px solid #ebeef0', borderBottom: `2px solid ${showPage === 'hardware' ? x : '#ebeef0'}` }}
              style={{ width: '100%', borderBottom: `2px solid ${showPage === 'general' ? x : '#ebeef0'}` }}
              onClick={() => setShowPage('general')}
              className='user'
              p={4}
            >
              General Request</Center>
            {/* <Center
              style={{ width: '25%', borderRight: '2px solid #ebeef0', borderBottom: `2px solid ${showPage === 'hardware' ? x : '#ebeef0'}` }}
              onClick={() => setShowPage('hardware')}
              className='user'
              p={4}
            >
              Hardware</Center>
            <Center
              style={{ width: '25%', borderRight: '2px solid #ebeef0', borderBottom: `2px solid ${showPage === 'email' ? x : '#ebeef0'}` }}
              onClick={() => setShowPage('email')}
              className='user'
              p={4}
            >
              Email</Center>
            <Center
              style={{ width: '25%', borderRight: '2px solid #ebeef0', borderBottom: `2px solid ${showPage === 'transfer' ? x : '#ebeef0'}` }}
              onClick={() => setShowPage('transfer')}
              className='user'
              p={4}
            >
              Transfer</Center>
            <Center
              style={{ width: '25%', borderBottom: `2px solid ${showPage === 'faqs' ? x : '#ebeef0'}` }}
              onClick={() => setShowPage('faqs')}
              className='user'
              p={4}
            >
              FAQs</Center> */}

          </Flex>
        </Box>

        {showPage === 'hardware' ? <Hardware /> : ''}
        {showPage === 'email' ? <Email /> : ''}
        {showPage === 'general' ? <General /> : ''}
        {showPage === 'transfer' ? <Transfer /> : ''}
        {showPage === 'faqs' ? <FAQs /> : ''}


      </Container>
    </>
  )
}
