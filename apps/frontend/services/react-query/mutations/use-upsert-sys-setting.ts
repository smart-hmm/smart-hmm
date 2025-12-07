import api from "@/lib/http";
import { useMutation } from "@tanstack/react-query";

const upsertSetting = async (payload: {key: string, value: Record<string, string | number | string[] | number[]> }) => {
    const { key, value } = payload
    const response = await api.put(`/system-settings/${key}`, { value })
    const data = response.data;
    return data
}

const useUpsertSysSetting = () => {
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: (payload: {key: string, value: Record<string, string | number | string[] | number[]> }) => upsertSetting(payload)
    })
    
    return {
        mutateAsync,
        isPending,
        error,
    }
}

export default useUpsertSysSetting;