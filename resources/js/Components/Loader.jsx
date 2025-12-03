import React from "react";
import styled from "styled-components";

const Loader = ({ visible = true }) => {
    if (!visible) return null;

    return (
        <StyledWrapper>
            <div className="overlay" role="status" aria-live="polite">
                <div className="loader">
                    <div className="loader-inner">
                        <div className="loader-block" />
                        <div className="loader-block" />
                        <div className="loader-block" />
                        <div className="loader-block" />
                        <div className="loader-block" />
                        <div className="loader-block" />
                        <div className="loader-block" />
                        <div className="loader-block" />
                    </div>
                    <div className="loading-text">loading...</div>
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

    .loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 16px 20px;
        border-radius: 8px;
    }

    .loader-inner {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loader-block {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin: 2px;
        background-color: #fff;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.9);
        animation: loader_562 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-radius: 2px;
    }

    .loader-block:nth-child(1) {
        animation-delay: 0.1s;
    }
    .loader-block:nth-child(2) {
        animation-delay: 0.2s;
    }
    .loader-block:nth-child(3) {
        animation-delay: 0.3s;
    }
    .loader-block:nth-child(4) {
        animation-delay: 0.4s;
    }
    .loader-block:nth-child(5) {
        animation-delay: 0.5s;
    }
    .loader-block:nth-child(6) {
        animation-delay: 0.6s;
    }
    .loader-block:nth-child(7) {
        animation-delay: 0.7s;
    }
    .loader-block:nth-child(8) {
        animation-delay: 0.8s;
    }

    .loading-text {
        color: #fff;
        font-size: 13px;
        text-transform: lowercase;
        opacity: 0.95;
    }

    @keyframes loader_562 {
        0% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        20% {
            transform: scale(1, 2.2);
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.7);
        }

        40% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }
    }
`;

export default Loader;
