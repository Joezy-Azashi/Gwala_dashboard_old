import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';


const CssFormControl = styled(FormControl)({
    backgroundColor: 'var(--color-white)',
    borderRadius: 0,
    fontFamily: "Rubik",
    color: 'var(--color-dark-blue)',
})

const CssSelect = styled(Select)({
    backgroundColor: '#828D9F',
    borderRadius: 0,
    fontFamily: "Rubik",
    color: '#fff',
    '&:focus': {
        borderColor: "red"
    }
})

const CssInputLabel = styled(InputLabel)({
    fontFamily: "Rubik",
    color: '#fff',
    fontStyle: 'italic',
    width: "100%",
    '& Mui-focused': {
        borderColor: "red"
    }
})

const BasicSelectOwner = ({ children, onChange, label, value, selectProps, InputLabelProps, formControlProps, disabled, size }) => {
    return (
        <CssFormControl {...formControlProps} disabled={disabled}>
            <CssInputLabel {...InputLabelProps} id={`basic-select-${label}`}>{label}</CssInputLabel>
            <CssSelect
                {...selectProps}
                labelId={`basic-select-${label}`}
                id={`id-basic-select-${label}`}
                value={value}
                label={label}
                onChange={onChange}
                size={size}
            >
                {children}
            </CssSelect>
        </CssFormControl>
    );
};

export default BasicSelectOwner;