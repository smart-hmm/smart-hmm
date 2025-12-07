import api from "@/lib/http"
import { useQuery } from "@tanstack/react-query"
import { QueryKey } from "../constants"

const getSysSettings = async () => {
    const response = await api.get("/system-settings")
    const data = response.data as {
        key: string,
        value: Record<string, string | number | string[] | number[]>,
        updated_at: string,
    }[]
    return data
}

const useSysSettings = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: [QueryKey.GET_SYSTEM_SETTINGS],
        queryFn: getSysSettings
    })

    return {
        data,
        isLoading,
        error
    }
}

export default useSysSettings