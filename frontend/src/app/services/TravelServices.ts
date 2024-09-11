
import axiosClient from "./axiosClient"

export const listTravel = async (id: string | undefined) => {
    try{
    const travel = await axiosClient.get(`travels/${id}`, {withCredentials: true})
        return travel;
    }catch(err){
        throw new Error('Failed getting the travel with this ID')
    }
}
