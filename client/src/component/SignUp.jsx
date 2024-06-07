import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React from 'react';
import { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom"

const SignUp = () => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [pic , setPic] = useState();
    const [show , setShow] = useState(false);
    const [loading , setLoading] = useState(false);
    
    const navigate = useNavigate();

    const toast = useToast();

    const postDetails = async (pics) => {
        
        setLoading(true);

        if(pics === undefined){
            toast({
                title : "Please Select an Image !",
                status : "warning",
                duration : 3000,
                isClosable : true,
                position : "top",
            });
            return;
        }

        if(pics.type === "image/jpeg" || pics.type === "image/jpg" || pics.type === "image/png")
        {
            const data = new FormData();
            data.append("file" , pics);
            data.append("upload_preset" , "chat-infinite");
            data.append("cloud_name" , "dsyinye1u");

            try{
                const response = await axios.post("https://api.cloudinary.com/v1_1/dsyinye1u/image/upload" , data);
                console.log(response);
                setPic(response.data.url.toString());
                setLoading(false);
            }
            catch(err)
            {
                console.log(err);
                setLoading(false);
            }


        }
        else
        {
            toast({
                title : "Please Select an Image !",
                status : "warning",
                duration : 3000,
                isClosable : true,
                position : "top",
            });

            setLoading(false);
        }
    }

    const submitHandler = async (e) => {
        
        setLoading(true);

        if(!name || !email || !password)
        {
            toast({
                title : "Please fill all the required details",
                status : "warning",
                duration : 3000,
                isClosable : true,
                position : "top",
            });

            setLoading(false);
            return;
        }

        try
        {
            const config = { headers : {"Content-type" : "application/json"} };

            const { data } = await axios.post("http://localhost:3000/api/user" , {
                name , email , password , pic
            } , config);

            toast({
                title : "Registration Successful",
                status : "success",
                duration : 3000,
                isClosable : true,
                position : "top",
            });

            localStorage.setItem("userInfo" , JSON.stringify(data));
            setLoading(false);

            navigate("/chats");
        }
        catch(err)
        {
            toast({
                title : "Error Occured!",
                status : "error",
                description : err.response.data.message,
                duration : 3000,
                isClosable : true,
                position : "top",
            });

            console.log("Error occured in sign in submit method : " + err);
            setLoading(false);
        }
    }

  return (
    <VStack spacing="5px" color="black">

        <FormControl id="first-name" isRequired>
            <FormLabel fontWeight="bold">Name</FormLabel>
            <Input placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)}/>
        </FormControl>

        <FormControl id="email" isRequired>
            <FormLabel fontWeight="bold">Email</FormLabel>
            <Input placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)}/>
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel fontWeight="bold">Password</FormLabel>
            <InputGroup>
                <Input type={show ? "text" : "password"} placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)}/>
                <InputRightElement width="4.5rem">
                    <Button onClick={() => setShow(!show)} size={"sm"} h={"1.75rem"}>{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="pic">
            <FormLabel fontWeight={"bold"}>Upload Your Picture</FormLabel>
            <Input type="file" p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0])}/>
        </FormControl>

        <Button colorScheme='blue' width="100%" style={{marginTop : 15}} onClick={submitHandler}
        isLoading={loading}>Sign Up</Button>

    </VStack>
  )
}

export default SignUp