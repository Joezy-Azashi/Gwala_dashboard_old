import React from "react";
import styled from "styled-components";

const Li = styled.li`
  width: 30px;
  height: 30px;
  background: ${({ selected }) => (selected ? "#D9EDFF" : "#f7f0f0")};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Pagination = ({ countPages, selectedPage, onClick, range }) => {
  return (
    <div>
      <ul style={{ listStyle: "none", display: "flex", gap: "10px" }}>
        {Array.from({ length: countPages }, (_, i) => i + 1).map((el, key) =>
          range + (key + 1) == selectedPage ||
          range - (key + 1) == selectedPage ||
          key + 1 == 1 ||
          key + 1 == countPages ? (
            <Li selected={selectedPage == key + 1} onClick={onClick}>
              {el}
            </Li>
          ) : (
            <>...</>
          )
        )}
      </ul>
    </div>
  );
};

export default Pagination;
