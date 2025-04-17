import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { setLanguage } from "../../store/reducer/userReducer";
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .sl-nav {
    display: inline;
  }
  .sl-nav ul {
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
    display: inline-block;
  }
  .sl-nav li {
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .sl-nav li ul {
    display: none;
  }
  .sl-nav li:hover ul {
    position: absolute;
    top: 29px;
    right: -15px;
    display: block;
    background: #fff;
    width: 120px;
    padding-top: 0px;
    z-index: 1;
    border-radius: 5px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  }
  .sl-nav li ul li {
    position: relative;
    text-align: left;
    background: transparent;
    padding: 15px 15px;
    padding-bottom: 0;
    z-index: 2;
    font-size: 15px;
    color: #3c3c3c;
  }
  .sl-nav li ul li:last-of-type {
    padding-bottom: 15px;
  }
  .sl-nav li ul li span {
    padding-left: 5px;
  }
  .sl-nav li ul li span:hover,
  .sl-nav li ul li span.active {
    color: #146c78;
  }
  .sl-flag {
    display: inline-block;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.4);
    width: 15px;
    height: 15px;
    background: #aaa;
    border-radius: 50%;
    position: relative;
    top: 2px;
    overflow: hidden;
  }
  .flag-fr {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAFVBAMAAABr/UoQAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAD1BMVEUAI5VUa7j////zcHvtKTm3QYn6AAAAAWJLR0QCZgt8ZAAAAAd0SU1FB+cEExY1D1qc384AAAGiSURBVHja7dBBEQAgDAOwapgEsIJ/TajoY3eJhCQNcwrua4gAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAcsCPvDCOKkC+zVVAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA0LTE5VDIyOjUzOjE1KzAwOjAwA5FKUwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNC0xOVQyMjo1MzoxNSswMDowMHLM8u8AAAAASUVORK5CYII=");
    background-size: cover;
    background-position: center center;
  }
  .flag-usa {
    background-size: cover;
    background-position: center center;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTM0A1t6AAABhUlEQVQ4T2Ows82PjGixsc4LD2tysC/09Kjw8622tyuICG8u0w/cpGSCBzF4e1VmZkzw9anOzOj38a4KCW4IC22ECHYk1l9tn4gHMeTlTnZxLikvm+XiUpKW2hvgX+vnV5OVOQEoOGfOtv94AYOzU3Fd7XxHh6Lq6rlurqUx0W0J8Z1AnbW18yotonaYuOJBDBXls4A+bGpaBCTz86YEBtQCvVBSPAPIbY0oP1/aiAcxABU1Ny+2tclvbFjo5FgUF9uenNwNDLnmpkWEnV1TPRcY1O1tS4H6i4umA/0MDK2K8tlAwRqHpP1uoXgQKKraWpcClTY3LQZaCLQ5NaUX5OaWJY3++SeTC/AgBmA4AXUClUJs9ver8fKsAAYEUJCws4G21dXNB1oFdD/Qz8DQTk4C+bm2dn6DZ9bRiDQ8iAEYt8CoBpK5YBIYw0AEEZwSXX4oMB4PYoC6gCzAcDqrjGzEsMfen2xEmbMv1rSTjRi26dqRjShz9o2+6WQjBrSShQSkZAIADvW/HLrLY6cAAAAASUVORK5CYII=");
  }
  .flag-ar {
    background-size: cover;
    background-position: center center;
    background: url("https://cdn.webshopapp.com/shops/94414/files/52406302/flag-of-morocco.jpg");
  }
  .lang {
    display: flex;
    gap: 8px;
  }
`;
const LangSwitch = ({ lang }) => {
  const dispatch = useDispatch();
  const changeLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    dispatch(setLanguage(lang));
  };
  return (
    <Container>
      <div className="sl-nav">
        <ul>
          <li>
            <div className="lang">
              <img src="/icons/Navbar/lang.svg" />
              <span>{lang}</span>
            </div>
            <ul>
              <li onClick={() => changeLanguage("fr")}>
                {/* <i className="sl-flag flag-fr"></i> */}
                <span className="active" style={{fontWeight: localStorage.getItem("lang") === "fr" ? 600 : "" }}>French</span>
              </li>
              <li onClick={() => changeLanguage("en")}>
                {/* <i className="sl-flag flag-usa"></i> */}
                <span className="active" style={{fontWeight: localStorage.getItem("lang") === "en" ? 600 : "" }}>English</span>
              </li>
              {/* <li onClick={() => changeLanguage("ar")}>
                <i className="sl-flag flag-ar"></i>
                <span>Arabic</span>
              </li> */}
            </ul>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default LangSwitch;
