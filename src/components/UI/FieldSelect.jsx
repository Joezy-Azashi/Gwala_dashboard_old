import { Field, DropDown } from "../employee/style";
import styled from "styled-components";
const FieldStyle = styled.div`
  display: "flex";
  flex-direction: "column";
  :hover {
    .childs {
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: center;
    }
  }
`;
const FieldSelect = ({ text, children }) => {
  // const [hide, setHidden] = useState(true);
  return (
    <FieldStyle>
      <Field>
        <span>{text}</span>
        <img src="/icons/Employee/filter.svg" />
      </Field>
      <DropDown className="childs">{children}</DropDown>
    </FieldStyle>
  );
};

export default FieldSelect;
