import React, { useEffect , useState} from 'react'
import { ChatState } from "../context/ChatProvider";
import { Box , FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import {ArrowBackIcon} from "@chakra-ui/icons";
import { getSender , getSenderFull } from '../config/ChatLogics';
import ProfileModal from "./ProfileModel.jsx"
import UpdateGroupChatModal from './UpdateGroupChatModel.jsx';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat.jsx';

const SingleChat = ({fetchAgain , setFetchAgain}) => {

    const {user , selectedChat , setSelectedChat} = ChatState();
    const [messages , setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage , setNewMessage] = useState();

    const toast = useToast();

    useEffect( () => {
        fetchMessages();
    } , [selectedChat]);

    const fetchMessages = async ()=> {

        if(!selectedChat)
            return;
    
        try {

            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                },
            }

            setLoading(true);
            
            const {data} = await axios.get(`http://localhost:3000/api/message/${selectedChat._id}`,config);

            console.log(messages);

            setMessages(data);

            setLoading(false);

        } catch (error) {

            console.log(error);
                toast({
                    title : "Error Occured !",
                    description : "Falid to send the Message",
                    status : "error",
                    duration : 3000,
                    isClosable : true,
                    position : "bottom"
                })
        }
    }

    const sendMessage = async (e) => {

        if(e.key === "Enter" && newMessage)
        {
            try {
                const config = {
                    headers : {
                        "Content-Type" : "application/json",
                        Authorization : `Bearer ${user.token}`
                    },
                }

                const {data} = await axios.post("http://localhost:3000/api/message",{
                    content : newMessage,
                    chatId : selectedChat._id
                }, config);

                console.log(data);

                setNewMessage("");
                setMessages([...messages , data]);

            } catch (error) {
                console.log(error);
                toast({
                    title : "Error Occured !",
                    description : "Falid to send the Message",
                    status : "error",
                    duration : 3000,
                    isClosable : true,
                    position : "bottom"
                })
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing Indicator logic
    }

  return (
    selectedChat ? 
    (
        <>
            <Text
            fontSize={{base : "20px" , md : "24px"}}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"Poppins"}
            display={"flex"}
            justifyContent={{base : "space-between"}}
            alignItems={"center"}
            >
                <IconButton
                display={{base : "flex" , md : "none"}}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                />

                {!selectedChat.isGroupChat ? 
                (
                    <>
                        {getSender(user,selectedChat.users)}
                        <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                    </>
                ) : 
                (
                    <>
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal 
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                        />
                    </>
                )}
            </Text>

            <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflowY={"hidden"}
            >
                {
                    loading ? <Spinner size={"xl"} w={10} h={10} alignSelf={"center"} margin={"auto"}/> : 
                    <div className='messages'>
                        <ScrollableChat messages={messages}/>
                    </div>
                }

                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    
                    <Input
                        variant="filled"
                        bg="#E0E0E0"
                        placeholder="Enter a message.."
                        value={newMessage}
                        onChange={typingHandler}
                    />

                </FormControl>
            </Box>
        </>
    ) : (
        <Box display={"flex"} alignItems={"center"}
        justifyContent={"center"} h="100%">

            <Text fontSize={"2xl"} pb={3} fontFamily={"Poppins"}>
                Click on a user to start chatting
            </Text>

        </Box>
    )
  )
}

export default SingleChat