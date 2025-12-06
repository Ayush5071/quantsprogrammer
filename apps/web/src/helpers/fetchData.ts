import axios from "axios";

export const fetchDataFromAPI = async () => {
    try {
        const response = await axios.get("/api/data/fetch");
        console.log(response.data);
        return response.data; 
    } catch (error: any) {
        console.error("Error fetching data:", error);
        return { error: error.message };
    }
};
