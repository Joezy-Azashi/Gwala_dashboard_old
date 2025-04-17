import React from "react";
import { ContFilter, Field } from "./style";
import MultiRangeSlider from "../UI/MultiRangeSlider";
const Filter = ({ children }) => {
  return (
    <ContFilter>
      <Field>
        <span>{`formatMessage({id: "filter.company"})`}</span>
        <img src="/icons/Employee/filter.svg" />
      </Field>
      <Field>
        <span>{`formatMessage({id: "filter.sortAlpha"})`}</span>
        <img src="/icons/Employee/filter.svg" />
      </Field>
      <Field>
        <span>Status du compte</span>
        <img src="/icons/Employee/filter.svg" />
      </Field>
      <div
        style={{
          background: "var(--color-blue)",
          height: "100px",
          borderRadius: 20,
          padding: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Montant (DH)</span>
          <img src="/icons/Employee/filter.svg" />
        </div>
        <MultiRangeSlider
          min={0}
          max={1000}
          style={{ marginTop: 1000 }}
          onChange={({ min, max }) => {}}
        />
      </div>
      {children && (
        <>
          <hr
            style={{
              border: "1px solid",
              width: "100%",
            }}
          />
          {children}
        </>
      )}
    </ContFilter>
  );
};

export default Filter;
