import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducer/userReducer";
import { Navigate } from "react-router";
import { useGetCurrentUser } from "../api/index";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();

  const logged = localStorage.getItem("token") ? true : false;

  const { data, error } = logged
    ? useGetCurrentUser()
    : { data: undefined, error: "" };

  // persist user data
  useEffect(() => {
    const langugae = localStorage.getItem("lang");
    dispatch(
      setUser({
        ...data?.data,
        type_employer: data?.data?.role, 
        role: data?.type,
        lang: langugae,
      })
    );
  }, [data]);

  if (error) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return logged ? (
    <div style={{ width: "100%", height: "100%" }}>{children}</div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
