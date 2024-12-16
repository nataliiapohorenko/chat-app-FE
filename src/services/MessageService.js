import { useHttp } from "../hooks/http.hook";

const useMessageService = () => {

    const { request, clearError, process} = useHttp();

    const _apiBase='http://localhost:8080/chat/';

    
    const getAllChats = async () => {
        const res = await request(`${_apiBase}`);
        return res.chats.map(({_id, botName, botSurname, lastMessage}) => {
            return{
                id: _id,
                name: botName + ' ' + botSurname,
                lastMessage: lastMessage ? lastMessage.content : '',
                date: lastMessage ? lastMessage.timestamp : ''
            }
        });
    }

    const getChat = async (id) => {
        const res = await request(`${_apiBase}/${id}`);
        return res.messages;
    }

    const sendMessage = async (body) => {
        const res = await request(`${_apiBase}/message`, 'POST', body);
        return res;
    }

    const createChat = async (body) => {
        const res = await request(`${_apiBase}/chat`, 'POST', body);
        return res;
    } 

    return {process, clearError, getAllChats, getChat, sendMessage, createChat}
}

export default useMessageService;