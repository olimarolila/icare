import React from "react";
import styled from "styled-components";

const Loader = ({ visible = true }) => {
    if (!visible) return null;

    return (
        <StyledWrapper>
            <div className="overlay" role="status" aria-live="polite">
                <div className="box">
                    <div className="cat" aria-hidden="true">
                        <div className="cat__body" />
                        <div className="cat__body" />
                        <div className="cat__tail" />
                        <div className="cat__head" />
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .overlay {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 9999;
        pointer-events: all;
    }

    .cat {
        position: relative;
        width: min(16rem, 70vw);
        max-width: 20rem;

        overflow: hidden;
        border-radius: 1rem;
    }

    .cat::before {
        content: "";
        display: block;
        padding-bottom: 100%;
    }

    .cat > * {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        animation: cat-rotate 2.79s cubic-bezier(0.65, 0.54, 0.12, 0.93) infinite;
    }

    .cat:active > * {
        animation-play-state: running;
    }

    .cat > *::before {
        content: "";
        position: absolute;
        width: 50%;
        height: 50%;
        background-size: 200%;
        background-repeat: no-repeat;
        background-image: url("/images/loading 1.png");
    }

    .cat__head {
        animation-delay: 0s;
    }

    .cat__head::before {
        top: 0;
        right: 0;
        background-position: 100% 0%;
        transform-origin: 0% 100%;
        transform: rotate(90deg);
    }

    .cat__tail {
        animation-delay: 0.2s;
    }

    .cat__tail::before {
        left: 0;
        bottom: 0;
        background-position: 0% 100%;
        transform-origin: 100% 0%;
        transform: rotate(-30deg);
    }

    .cat__body {
        animation-delay: 0.1s;
    }

    .cat__body:nth-of-type(2) {
        animation-delay: 0.2s;
    }

    .cat__body::before {
        right: 0;
        bottom: 0;
        background-position: 100% 100%;
        transform-origin: 0% 0%;
    }

    .loading-label {
        font-size: 0.9rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #3f1c1c;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }

    @keyframes cat-rotate {
        from {
            transform: rotate(720deg);
        }
        to {
            transform: rotate(0deg);
        }
    }
`;

export default Loader;