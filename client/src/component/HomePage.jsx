import React from 'react';
import { Box, Container , Text , Tab , TabList , TabPanel , TabPanels , Tabs } from "@chakra-ui/react";
import Login from './Login';
import SignUp from './SignUp';

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>

        <Box d="flex" justifyContent="center" alignItems="center" p={3} 
        bg={"white"} w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">

          <Text fontSize="4xl" fontFamily="Poppins" color="bl" align="center">Chat Infinite</Text>
        </Box>

        <Box bg="white" p={4} w="100%" borderRadius="lg" borderWidth="1px" color="black">
          <Tabs variant='soft-rounded'>

          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>

            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
        </Box>
    </Container>
  )
}

export default HomePage