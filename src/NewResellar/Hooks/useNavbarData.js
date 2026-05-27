import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useNavbarData = () => {
  const base_url = import.meta.env.VITE_BASE_URL;

  const {
    data: logo = [],
    isLoading: logoLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["logo"],
    queryFn: async () => {
      const res = await axios.get(`${base_url}/logo`);
      return res.data;
    },
  });

  return { logo, logoLoading, error, refetch };
};

export default useNavbarData;
