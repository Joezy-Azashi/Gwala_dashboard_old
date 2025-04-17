import { createContext } from "react";
import Axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLogout } from "../store/reducer/userReducer";
import { useNavigate } from "react-router";

const axiosMerchant = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + "/v2/proxy/",
});

axiosMerchant.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const logout = () => {
    localStorage.clear()
    window.location.assign('/login')
};

axiosMerchant.interceptors.response.use(
    (response) => {
        const data = response;
        if (response.status <= 299 && response.status >= 200) {
            return data;
        }
        return Promise.reject(new Error(response.statusText || "Error"));
    },
    (error) => {
        if (error.response && error.response.status) {
            switch (error.response.status) {
                case 401:
                    toast(localStorage.getItem("lang") === "fr" ? "Token expiré, veuillez vous reconnectez !" : localStorage.getItem("lang") === "en" ? "Token expired, please login again !" : "Token expiré, veuillez vous reconnectez !", {
                        position: "top-right",
                        theme: "colored",
                        type: "error",
                        toastId: "id"
                    });
                    logout()
                    break;
                case 403:
                    logout()
                    break;

                case 404:
                    toast(error.response.data.message, {
                        position: "top-right",
                        theme: "colored",
                        type: "error",
                    });
                    break;
                case 406:
                    toast(error.response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        type: "error",
                    });
                    break;
                default:
                    toast(error.response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        type: "error",
                        theme: "colored",
                    });
            }
            return error;
        }

        // throw new Error(error);
        return Promise.reject(error);
    }
);

export const AxiosContextMerchant = createContext(
    new Proxy(axiosMerchant, {
        apply: () => {
            throw new Error("You must wrap your component in an AxiosProvider");
        },
        get: () => {
            throw new Error("You must wrap your component in an AxiosProvider");
        },
    })
);

export const useAxios = () => {
    return useContext(AxiosContextMerchant);
};

const useCreate = (url) => {
    const axios = useAxios();
    return useMutation(async (params) => {
        const data = await axios.post(`${url}`, params);
        return data;
    });
};
const useUpdate = (url) => {
    const axios = useAxios();
    return useMutation(async (params) => {
        const data = await axios.put(`${url}`, params);
        return data;
    });
};
const useGetOne = (key, url, params) => {
    const axios = useAxios();
    const service = async () => {
        const data = await axios.get(`${url}`, params);
        return data;
    };
    return useQuery(key, () => service());
};
const useGetPaginated = (key, url, page = 1, limit = 10) => {
    const axios = useAxios();
    const service = async () => {
        const data = await axios.get(`${url}page=${page}&limit=${limit}`);
        return data;
    };
    return useQuery([key, page, limit], () => service(), {
        enabled: !!page,
    });
};

const useGetByRole = (key, url, page, limit, isAdmin) => {
    const axios = useAxios();
    const service = async () => {
        const data = await axios.get(`${url}?page=${page}&limit=${limit}`);
        return data;
    };
    return useQuery([key, page, limit], () => service(), {
        enabled: isAdmin,
    });
};

export { useCreate, useGetOne, useGetPaginated, useUpdate, useGetByRole };

export default axiosMerchant;
