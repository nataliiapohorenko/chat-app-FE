import { useState, useCallback } from "react";
import axios from "axios";

export const useHttp = () => {
    const [process, setProcess] = useState('waiting');

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'})=> {
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
