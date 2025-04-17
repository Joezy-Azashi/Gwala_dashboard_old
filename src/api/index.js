import { useEffect } from "react";
import axios, {
  useCreate,
  useGetOne,
  useGetPaginated,
  useUpdate,
} from "./request";
import { useState } from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Axios from "axios";
import axiosMerchant from "./merchantRequest";

export const useLogin = () => {
  return useCreate("/employers/login");
};
export const adminLogin = () => {
  return useCreate("/admin/auth/login");
};

export const useGetTransactions = (page = 1, limit = 10) => {
  const [data, setTransactions] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/advances/users?page=${page}&limit=${limit}`
        );
        setTransactions(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);
  return { data, loading, error };
};

export const getAdvancesByDay = (days) => {
  return useGetOne("statsDay", `/statistics/advances/by/${days}/days`);
};
export const getAdvancesByYear = () => {
  return useGetOne("statsYear", "/statistics/advances/by/year");
};

export const getStats = () => {
  const [data, setStats] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/statistics/");
        setStats(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return { data, loading, error };
};

export const useGetCurrentUser = () => {
  const [data, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/account/me");
        setUser(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return { data, loading, error };
};

export const getCompanies = (page, limit, isAdmin) => {
  const [data, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/companies?limit=10000");

        setUser(response?.data?.docs);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return { data, loading, error };
};
export const getConversations = (page, limit) => {
  return useGetPaginated("allConversations", "/message?", page, limit);
};

export const getCompanyById = (id) => {
  return useGetOne("userDetails", `/companies/${id}`);
};
export const getEmployeeById = (id, refetch) => {
  const [data, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/account/${id}`);
        setUser(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [refetch]);
  return { data, loading, error };
};

export const validateAdvance = (url) => {
  return useUpdate(`/advances/${url}`);
};

export const useCreateEmployee = (id) => {
  return useCreate(`/register/employees/single?companyId=${id}`);
};

export const getTransactions = async (page, limit, filter, id) => {
  const result = await axios.get(
    `/advances/users?page=${page}&limit=${limit}&${filter}&userId=${id || ""}`
  );
  return result.data;
};

export const getPhoneRequests = async (page, limit, filter) => {
  const result = await axios.get(
    `/support/phone/lost?page=${page}&limit=${limit}&${filter}`
  );
  return result.data;
};

export const getTags = async (text) => {
  const result = await axios.get(`/v2/edocuments/tags?name=${text}`);
  return result;
};
export const getEmployees = async (page, limit, filter, feature, sort) => {
  const result = await axios.get(
    `/account/users?page=${page}&limit=${limit}&kycDocumentsSort=1&${filter && `${filter}`}&${sort !==undefined ? `nameSort=${sort}` : ""}`,
    {
      params: {
        features: feature
      },
    }
  );
  return result.data;
};
export const getEmployers = async (page, limit, filter) => {
  const result = await axios.get(
    `/employers?page=${page}&limit=${limit}&${filter}&sort=-1`
  );
  return result.data;
};

export const fetchCompanies = async (page, limit, filter, feature) => {
  const result = await axios.get(
    `/companies?page=${page}&limit=${limit}&${filter}`,
    {
      params: {
        features: feature
      },
    }
  );
  return result.data;
};
export const getTransactionByUserId = (id, page, limit) => {
  const [transactions, setTransactions] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/advances/users?userId=${id}&page=${page}&limit=${limit}`
        );
        setTransactions(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);
  return { transactions, loading, error };
};
export const getExpensesByUserId = (id, page, limit) => {
  const [expenses, setExpenses] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/v2/expenses?userId=${id}&page=${page}&limit=${limit}&sort=-1`
        );
        setExpenses(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);
  return { expenses, loading, error };
};

export const getMyCompany = ({ id }) => {
  return useGetOne("MyCompany", `/companies/${id}`);
};

export const getExpenses = (page, limit, filter, refetch) => {
  const [data, setExpenses] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = {
          ...((filter.userId && { userId: filter.userId }) || {}),
          ...((filter.status && { status: filter.status }) || {}),
          ...((filter.type && { type: filter.type }) || {}),
          ...((filter.startDate && { startDate: filter.startDate }) || {
            startDate: dayjs("2023-01-01"),
          }),
          ...((filter.endDate && { endDate: filter.endDate }) || {}),
          ...((filter.companyId && { companyId: filter.companyId }) || {}),
        };
        const queryParams = new URLSearchParams({ ...query });
        const response = await axios.get(
          `/v2/expenses?page=${page}&limit=${limit}&sort=-1&${queryParams}`
        );
        setExpenses(response?.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [page, limit, filter, refetch]);
  return { data, loading, error };
};

export const getExpenseById = (id) => {
  const [expense, setExpense] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/v2/expenses/${id}`);
        setExpense(response?.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  return { expense, loading, error };
};

export const useGetSession = (filter, page = 1) => {
  const [sessions, setSession] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const query = {
          ...((filter.sort_worked_minutes && {
            sort_worked_minutes: filter.sort_worked_minutes,
          }) ||
            {}),
          // ...((filter.statuses && { statuses[]: filter.statuses || []),
          ...((filter.endDate && {
            endDate: dayjs(filter.startDate).endOf("day").toISOString(),
          }) ||
            {}),
          ...((filter.startDate && {
            startDate: filter.startDate.toISOString(),
          }) ||
            {}),
          ...((filter.sort_alphabeticaly && {
            sort_alphabetically: filter.sort_alphabeticaly,
          }) ||
            {}),
        };

        const queryParams = new URLSearchParams({ ...query });
        const response = await axios.get(
          `/v2/time-tracking/work-days/all?limit=10&${queryParams}&page=${page}`,
          {
            params: {
              statuses: filter?.statuses,
            },
          }
        );
        setSession(response?.workDays);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [filter, page]);
  return { sessions, loading, error };
};
export const getTimeTrackingStatistics = (id, startDate, endDate, period) => {
  const [statistics, setStatistics] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/v2/time-tracking/statistics?userId=${id}&startDate=${startDate}&endDate=${endDate}&period=${period}`
        );
        setStatistics(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, startDate, endDate, period]);
  return { statistics, loading, error };
};

export const getAllWorkdaysCurrentUser = (startDate, endDate, status) => {
  const [allWorkDays, setAllWorkDays] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/v2/time-tracking/work-days/all?limit=10&startDate=${startDate}&endDate=${endDate}&status=${status}`
          // {
          //   params: {
          //     statuses: statuses
          //   },
          // }
        );
        setAllWorkDays(response?.workDays);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);
  return { allWorkDays, loading, error };
};

export const getDailyWorkdays = (id, startDate, endDate, getData) => {
  const [workDays, setWorkDays] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/v2/time-tracking/work-days/all?userId=${id}&startDate=${startDate}&endDate=${endDate}`
        );
        setWorkDays(response?.workDays);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate, getData]);
  return { workDays, loading, error };
};

export const getAllWorkdaysCurrentUserById = (id) => {
  const [allWorkDays, setAllWorkDays] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/v2/time-tracking/work-days/all?userId=${id}`
        );
        setAllWorkDays(response?.workDays);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return { allWorkDays, loading, error };
};
export const getOffdays = ({
  userId,
  type,
  filter,
  page = 1,
  getData,
  companyIds,
  fetch,
  sort,
}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const query = {
          ...((filter.endDate && {
            endDate: filter.endDate,
          }) ||
            {}),
          ...((filter.startDate && {
            startDate: filter.startDate,
          }) ||
            {}),
          ...((filter.status && { status: filter.status }) || {}),
          ...((userId && { userId }) || {}),
        };
        const queryParams = new URLSearchParams({ ...query });
        const response = await axios.get(
          companyIds
            ? `/v2/off-days?type=${type}&${queryParams}&page=${page}&limit=10&companyId=${companyIds}&sort=${sort}`
            : `/v2/off-days?type=${type}&${queryParams}&page=${page}&limit=10&sort=${sort}`
        );
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [filter, type, page, getData, fetch, sort]);
  return { data, loading, error };
};
export const getPhoneRequestsById = (
  userId,
  page,
  limit,
  sort,
  filter,
  fetch
) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const query = {
          ...((filter.endDate && {
            endDate: filter.endDate,
          }) ||
            {}),
          ...((filter.startDate && {
            startDate: filter.startDate,
          }) || {
            startDate: dayjs("2023-01-01"),
          }),
          ...((filter.status && { status: filter.status }) || {}),
        };
        const queryParams = new URLSearchParams({ ...query });
        const response = await axios.get(
          `/support/phone/lost?page=${page}&limit=${limit}&${queryParams}&userId=${userId}&sort=${sort}`
        );
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [page, filter, sort, fetch]);
  return { data, loading, error };
};

export const getLostPhoneRequests = (
  page,
  limit,
  filter,
  companyIds,
  sort,
  fetch
) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const query = {
          ...((filter.endDate && {
            endDate: filter.endDate,
          }) ||
            {}),
          ...((filter.startDate && {
            startDate: filter.startDate,
          }) || { startDate: dayjs("2023-01-01") }),
          ...((filter.status && {
            status: filter.status === "APPROVED" ? "ACCEPTED" : filter.status,
          }) ||
            {}),
        };
        const queryParams = new URLSearchParams({ ...query });
        const response = await axios.get(
          companyIds
            ? `/support/phone/lost?page=${page}&limit=${limit}&sort=${sort}&companyId=${companyIds}&${queryParams}`
            : `/support/phone/lost?page=${page}&limit=${limit}&sort=${sort}&${queryParams}`
        );
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [page, filter, fetch, sort]);
  return { data, loading, error };
};

export const getEdocs = ({
  page = 1,
  limit = 10,
  filter,
  companyIds,
  sort,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const fetchData = async () => {
    try {
      const query = {
        ...((filter.endDate && {
          endDate: filter.endDate,
        }) ||
          {}),
        ...((filter.startDate && {
          startDate: filter.startDate,
        }) || { startDate: dayjs("2023-01-01") }),
        ...((filter.status && {
          status: filter.status === "APPROVED" ? "PROCESSED" : filter.status,
        }) ||
          {}),
      };
      const queryParams = new URLSearchParams({ ...query });
      const response = await axios.get(
        companyIds
          ? `/v2/edocuments/requests?page=${page}&limit=${limit}&companyId=${companyIds}&sort=${sort}&${queryParams}`
          : `/v2/edocuments/requests?page=${page}&limit=${limit}&sort=${sort}&${queryParams}`
      );
      setData(response?.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [page, filter, sort]);
  const refetch = () => {
    fetchData();
  };
  return { data, loading, error, refetch };
};
export const AllEdocs = (tag, sort) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/v2/edocuments/tags/all?name=${tag}&sort=${sort}&title=${title}&page=${page}&limit=${limit}`
        );
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [tag, title, sort, page, getData]);
  return { data, loading, error };
};

export const getAllTags = (getData, id) => {
  const [allTags, setAllTags] = useState();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          id
            ? `/v2/edocuments/tags/all?limit=${30}&sort=1&companyId=${id}`
            : `/v2/edocuments/tags/all?limit=${30}&sort=1`
        );
        setAllTags(response?.data);
        setLoad(false);
      } catch (error) {
        setLoad(false);
      }
    };
    fetchData();
  }, [getData, id]);
  return { allTags, load };
};

export const AllEdocsByTag = (
  tagId,
  startDate,
  endDate,
  employeeName,
  page,
  limit,
  id
) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        id
          ? `/v2/edocuments?startDate=${startDate}&endDate=${endDate}&searchQuery=${employeeName}&page=${page}&limit=${limit}&companyId=${id}`
          : `/v2/edocuments?startDate=${startDate}&endDate=${endDate}&searchQuery=${employeeName}&page=${page}&limit=${limit}`,
        {
          params: {
            tagIds: tagId,
          },
        }
      );
      setData(response?.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [tagId, startDate, endDate, employeeName, page, id]);
  const refreshData = () => {
    fetchData();
  };
  return { data, loading, error, refreshData };
};

export const SomeEdocsByTag = (tagId, title, page, limit, id) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          id
            ? `/v2/edocuments?tagId=${tagId}&title=${title}&page=${page}&limit=${limit}&companyId=${id}`
            : `/v2/edocuments?tagId=${tagId}&title=${title}&page=${page}&limit=${limit}`
        );
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [tagId, title, page]);
  return { data, loading, error };
};



export const getRequestedVouchers = async (page, limit, filter, id) => {
  const result = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/v2/request/vouchers?page=${page}&limit=${limit}&${filter}`
  );
  return result.data;
};

export const getNondigitalAssignedVouchers = async (page, limit, filter) => {
  const result = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/v2/vouchers/code?page=${page}&limit=${limit}&${filter}`
  );
  return result.data;
};

export const getUsedVouchers = async (page, limit, filter, id) => {
  const result = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/v2/assign/vouchers?page=${page}&limit=${limit}&${filter}`
  );
  return result.data;
};

export const getVouchersUsers = async (page, limit, id) => {
  const result = await axios.get(
    `/account/users?page=${page}&limit=${limit}&${id !== undefined && `companyId=${id}`}`
  );
  return result.data;
};

export const getVouchersUsersByName = async (page, limit, filter) => {
  const result = await axios.get(
    `/account/users?page=${page}&limit=${limit}&${filter}`
  );
  return result.data;
};

export const getVouchersUsersByEmployer = async (page, limit, filter) => {
  const result = await axios.get(
    `/employers?page=${page}&limit=${limit}&${filter}`
  );
  return result.data;
};

export const getVouchers = async (filter) => {
  const result = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/v2/vouchers?${filter}`
  );
  return result.data;
};


export const createAssingVouchers = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/v2/assign/voucher/user`
    , data
  );
  if (result?.response?.data?.status === "failure") return "failure";
  return result.data;
};

export const convertVoucher = async (data) => {
  const result = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/v2/vouchers/transference`
    , data
  );
  if (result?.response?.data?.status === "failure") return "failure";
  return result;
};

export const createAssingVouchersSms = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/v2/assign/voucher/sms`
    , data
  );
  return result;
};

export const injectExcel = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/v2/assign/voucher/user/excel`
    , data
  );
  return result;
};

export const createAssingVouchersPhysical = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/v2/assign/voucher/physical`
    , data
  );
  if (result?.response?.data?.status === "failure") return "failure";
  return result;
};

export const MerchantLogin = async (data) => {
  const result = await axiosMerchant.post(`/login`, data);
  return result.data;
};