import React, { useState } from "react";
import styled from "styled-components";
import { IconButton, Box } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';

const InputStyle = styled.input`
  width: 100%;
  border-radius: 10px 0 0 10px;
  padding: 10px;
  font-size: 13px;
  font-style: italic;
  line-height: 15.41px;
  background: #f7f0f0;
  color: #002b69;
  border: none;
  height: 36px
`;
const Input = ({ type, value, onChange, placeholder }) => {

    const [showPassword, setShowPassword] = useState(false)

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <InputStyle
                type={showPassword ? 'text' : type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            <Box sx={{ backgroundColor: "#f7f0f0", borderRadius: '0 10px 10px 0', width: "3rem", padding: "auto" }}>
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
            </Box>
        </Box>
    );
};

export default Input;