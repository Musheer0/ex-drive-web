
export const GetUserInfo =async ()=>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/v1/token/verify`,{
        method:'POST',
        credentials: 'include'
    })
    if(!response.ok) return null;
    const data = await response.json();
    return data.data
    } catch  {
        return null;
    }
}