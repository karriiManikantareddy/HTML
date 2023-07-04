import axios from 'axios'

const url ="http://localhost:3001/posts";
export const getData = async ()=>{
    return await axios.get(url);
}
export const deleteData = async (id)=>{
    return await axios.delete(`${url}/${id}`);
}
export const postData = async (data)=>{
    return await axios.post(url,data,{
'headers':'application/json'
    })
}