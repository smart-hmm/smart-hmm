import { useQuery } from "@tanstack/react-query"
import { QueryKey } from "../constants"
import api from "@/lib/http"
import type { TenantMetadataConfig } from "@/types/metadata"

const getMetadataTenant = async () => {
    const resp = await api.get("/metadata/tenant")
    const data = resp.data as TenantMetadataConfig;
    return data;
}

const useTenantMetadata = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: [QueryKey.GET_METADATA_TENANT],
        queryFn: getMetadataTenant
    })

    return {
        data,
        isLoading,
        error
    }
}

export default useTenantMetadata