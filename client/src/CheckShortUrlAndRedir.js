import React, { useEffect, useState } from 'react';
import  {useParams, Redirect} from 'react-router-dom';
import axios from 'axios';

const CheckShortUrlAndRedir = ()=>{
    const {shorturl} = useParams();
    const [redirUrl, setRedirUrl] = useState('');

    useEffect(()=>{
        const fn = async () => {
            try {
                const response=await axios.get(`http://localhost:5000/greenonion/api/redir2longurl/${shorturl}`);
                //console.log(response);
                if(response.status == 200) {
                    const longUrl = response.data.longUrl;        
                    if(longUrl != null && longUrl.trim() != '')  {  
                        window.location.href = longUrl; 
                    }
                }
            }
            catch (err) 
            {
                if(err.response.status == 404) {
                    setRedirUrl ('/greenonion/404') ;
                }
            }
        };
        fn();
    }, [shorturl]);

    return (
        <>
        { redirUrl != '' && 
            <Redirect to={redirUrl}></Redirect>    
        }
        </>
    );
}

export default CheckShortUrlAndRedir;