// hooks/useCategories.js

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useCategories = () => {
  const base_url = import.meta.env.VITE_BASE_URL;

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get(`${base_url}/category`);
      return data;
    },
  });

  return {
    categories,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useCategories;
