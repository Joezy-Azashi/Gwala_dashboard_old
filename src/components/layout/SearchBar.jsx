import { useState, useEffect } from "react";
import styled from "styled-components";
import { getEmployees } from "../../api";
import { useNavigate } from "react-router";
import { useLocale } from "../../locales";
import axios from "../../api/request";
import { Close } from "@mui/icons-material";
const Bar = styled.div`
  background-color: #d9edff;
  border-radius: 35px;
  width: 100%;
  width: 300px;
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
  // :hover {
  //   .users {
  //     display: flex;
  //   }
  // }
  @media (max-width: 490px) {
    max-width: 93%;
  }
  > img {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    cursor: pointer;
  }
  .users {
    position: absolute;
    top: 100%;
    z-index: 4;
    background: #fbfbfb;
    display: flex;
    gap: 4px;
    flex-direction: column;
    /* padding: 15px; */
    width: 100%;
    border-radius: 3px;
    // display: none;
    height: auto;
    overflow-y: auto;
  }
  .user {
    cursor: pointer;
    border-bottom: 0.1px solid rgb(230 234 241);
    padding: 10px;
    span {
      font-weight: bolder;
    }
    p {
      font-size: 14px;
    }
  }
`;
const Input = styled.input`
  background-color: #d9edff;
  border: 0;
  padding: 10px;
  border-radius: 35px;
  width: -webkit-fill-available;
`;

const SearchBar = ({ handleCloseMenu }) => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [allUsers, setUsers] = useState([]);
  const [loading, setLoading] = useState(false)
  const [timeoutMulti, setTimeoutMulti] = useState(null)
  const role = localStorage.getItem("role");
  const path = window.location.pathname

  const getEmployees = async (text) => {
    const result = await axios.get(
      `/account/users?page=${1}&limit=${9}&searchQuery=${text}&kycDocumentsSort=1`
    );
    setUsers(result?.data?.docs);
    setLoading(false)
  }

  const handleSearchChange = (e) => {
    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setText(e.target.value)
    setLoading(true)
    setTimeoutMulti(setTimeout(() => {
      getEmployees(e.target.value)
    }, 1500))
  }

  return (
    <Bar>
      <Input
        type={"text"}
        placeholder={formatMessage({ id: "nav.search" })}
        value={text}
        onChange={(e) => handleSearchChange(e)}
      />
      {text?.length > 0 ?
        <Close sx={{ color: "#cccccc", cursor: "pointer", width: "40px !important", position: "absolute", right: "10px" }} onClick={() => setText("")} /> :
        <img src="/icons/Navbar/loop.svg" />
      }
      <div className="users" style={{ display: text.length > 0 ? "flex" : "none" }}>
        {loading ?
          <div
            className="user"
          >
            <span>
              loading...
            </span>
          </div>
          :
          allUsers?.length < 1 ?
            <div
              className="user"
            >
              <span>
                {formatMessage({ id: "evoucher.notfound" })}
              </span>
            </div>
            :
            allUsers?.map((user) => {
              if (!user?.company || !user?._id) return;
              return (

                // Render the filtered users here
                <div
                  key={user._id}
                  className="user"
                  onClick={() => {
                    role === "Admin" ? navigate(`/employee-edit/${user?._id}`) : navigate(`/employee/${user?._id}`, {
                      state: { name: user?.firstName },
                    });
                    setUsers([]);
                    setText("");
                    if (path.split("/")[1] === 'employee-edit' || path.split("/")[1] === "employee") { navigate(0) };
                    handleCloseMenu && handleCloseMenu(false)
                  }}

                >

                  <span>
                    {user?.firstName} {user?.lastName}
                  </span>
                  <p>{user?.company?.name}</p>
                </div>
              )
            }

            )}
      </div>
    </Bar>
  );
};

export default SearchBar;
