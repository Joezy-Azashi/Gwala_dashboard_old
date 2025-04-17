import Navbar from "../../components/layout/Navbar";
import { Outlet } from "react-router";
import SecondNav from "../../components/layout/SecondNav";
import styled from "styled-components";
import SideNav from "../../components/layout/SideNav";
import { useSelector } from "react-redux";

const Div = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  @media (max-width: 790px) {
    .Second {
      display: none;
    }
    .SideNav {
      display: flex;
    }
  }
`;
const LayoutPage = () => {
  const userInfos = useSelector((state) => state.userInfos);

  return (
    <Div>
      {!userInfos.sideNav && <Navbar userInfos={userInfos} />}
      <SecondNav />
      {userInfos.sideNav && <SideNav userInfos={userInfos} />}
      <Outlet />
    </Div>
  );
};

export default LayoutPage;
