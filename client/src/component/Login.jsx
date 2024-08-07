import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack , useToast } from '@chakra-ui/react'
import React , {useState} from 'react'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { ChatState } from '../context/ChatProvider';

const Login = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [show , setShow] = useState(false);
    const [loading,setLoading] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const {setUser} = ChatState();

    const submitHandler = async (e) => {

      setLoading(true);

      if (!email || !password) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
  
      try {
  
        const { data } = await axios.post(
          "http://localhost:3000/api/user/login",
          { email, password }
        );
  
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        setUser(data);
        
        localStorage.setItem("userInfo", JSON.stringify(data));

        setLoading(false);

        navigate("/chats");

      } catch (error) {

        console.log(error);

        toast({
          title: "Error Occured!",
          description: error.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    };

  return (
    <VStack spacing="5px" color="black">

        <FormControl id="email" isRequired>
            <FormLabel fontWeight="bold">Email</FormLabel>
            <Input placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} value={email}/>
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel fontWeight="bold">Password</FormLabel>
            <InputGroup>
                <Input type={show ? "text" : "password"} placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button onClick={() => setShow(!show)} size={"sm"} h={"1.75rem"}>{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>


        <Button colorScheme='blue' width="100%" style={{marginTop : 15}} onClick={submitHandler} isLoading={loading}>Login</Button>
        <Button variant="solid" colorScheme="red" width="100%"
        onClick={(e) => {
          setEmail("guest@example.com");
          setPassword("12345");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login