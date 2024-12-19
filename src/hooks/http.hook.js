import { useState, useCallback } from "react";
import axios from "axios";

export const useHttp = () => {
    const [process, setProcess] = useState('waiting');
    const storedItem = localStorage.getItem('authToken');
    let token = null;
    if(storedItem){
        const { token: storedToken } = JSON.parse(storedItem);
        token = storedToken;
    }
    const request = useCallback(async (url, method = 'GET', body = {}, 
                                headers = {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`})=> {
        setProcess('loading');
        try{
            const response = await axios({url, method, data:body, headers});
            setProcess('success');
            return response.data;
        }catch(e){
            setProcess('error');
            throw e;
        }
    }, []);
    const clearError = useCallback(()=>{
        setProcess('loading');
    }, []);

    return { request, clearError, process}
}
