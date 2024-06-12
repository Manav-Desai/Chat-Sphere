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
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
var socket , selectedChatCompare;

const SingleChat = ({fetchAgain , setFetchAgain}) => {

    const {user , selectedChat , setSelectedChat , notification , setNotification} = ChatState();
    const [messages , setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage , setNewMessage] = useState();
    const [socketConnected , setSocketConnected] = useState(false);
    const [typing , setTyping] = useState(false);
    const [isTyping , setIsTyping] = useState(false);

    const toast = useToast();

    useEffect( () => {

        // Code for implementing socket io
        
        socket = io(ENDPOINT);

        console.log("Inside socket useEffect : ");
        console.log(socket);

        socket.emit("setup" , user);
        socket.on("connected" , () => {setSocketConnected(true)});

        socket.on("typing" , () => setTyping(true));
        socket.on("stop typing" , () => setTyping(false));

    } , []);

    useEffect( () => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    } , [selectedChat]);
    
    useEffect( () => {

        socket.on("message recieved" , (newMessageRecieved) => {

            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id)
            {
                // we will give notification
                if(!notification.includes(newMessageRecieved))
                {
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else
            {
                setMessages([...messages , newMessageRecieved]);
            }
        });
    })

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

            socket.emit("join chat" , selectedChat._id);

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
        // socket.emit("stop typing" , selectedChat._id);

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

                socket.emit("new message" , data);
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

        if(!socketConnected)
            return;
    
        if(!typing)
        {
            setTyping(true);
            socket.emit("typing" , selectedChat._id);
        }

        let lastTypingTime = new Data().getTime();
        let timerLength = 3000;

        setTimeout( ()=>{
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing)
            {
                socket.emit("stop typing" , selectedChat._id);
                setTyping(false);
            }

        } , timerLength)
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
                    
                    {isTyping ? 
                    <div>
                        Loading...
                    </div> : <></>}

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