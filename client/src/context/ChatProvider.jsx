import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

const ChatContext = createContext({});

const ChatProvider = ({children}) => {

    const [user,setUser] = useState(1234);
    const [selectedChat , setSelectedChat] = useState();
    const [chats , setChats] = useState([]);

    const navigate = useNavigate();

    useEffect( () => {

        console.log("Inside Chat Provider");
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        if(!userInfo)
        {
            navigate("/");
        }

        setUser(userInfo);

    } , [navigate])

    return (
        <>
            <ChatContext.Provider value={{user,setUser , selectedChat ,setSelectedChat , chats , setChats}}>
                {children}
            </ChatContext.Provider>
        </>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;