import React from 'react';


const FallbackComponent = ({ error }) => {
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <h3 style={{ color: "var(--color-danger)" }}>Error: <span style={{ color: "var(--color-dark-blue)" }}>{error.message}</span></h3>
        </div>
    );
};

export default FallbackComponent;