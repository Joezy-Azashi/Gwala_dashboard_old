import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  .row-side {
    height: 100%;
    padding: 0px 20px 0px 15px;
  }
  @media (max-width: 930px) {
    .col-md-3 {
      display: none !important;
    }
  }
`;
const SMSSideContainer = ({ RightSideComponent, LeftSideComponent, subtabIndex }) => {
    return (
        <Container className="container-fluid" id="container">
            <div className="row row-side">
                {/* Left Side*/}
                <div
                    className={subtabIndex === "2" || subtabIndex === "3" ? "col-lg-9 col-md-12 col-sm-12" : "col-lg-12 col-md-12 col-sm-12"}
                    style={{ paddingTop: ".5rem" }}
                >
                    {LeftSideComponent}
                </div>
                {/* Left Side*/}

                {/* Right Side*/}
                {subtabIndex === "2" || subtabIndex === "3" ?
                    <div
                        className="col-lg-3 col-md-12 col-sm-12 d-lg-block"
                        style={{
                            backgroundColor: "var(--color-cyan-light)",
                            width: "100%",
                        }}
                    >
                        {RightSideComponent}
                    </div> : ""
                }
                {/* Right Side*/}
            </div>
        </Container>
    );
};

export default SMSSideContainer;
