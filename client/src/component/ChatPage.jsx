import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SlideDrawer from './SlideDrawer';
import MyChats from './MyChats';
import ChatBox from './ChatBox';

const ChatPage = () => {

    const { user } = ChatState()
    const [fetchAgain,setFetchAgain]=useState(false)
    
    return (
        <div style={{ width: "100%" }}>
        {user && <SlideDrawer />}
        <Box
            display="flex"
            justifyContent={"space-between"}
            w="100%"
            h="91.5vh"
            p="10px"
        >
            {user && (
            <MyChats fetchAgain={fetchAgain}/>
            )}
            {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
        </Box>
        </div>
  );
}

export default ChatPage