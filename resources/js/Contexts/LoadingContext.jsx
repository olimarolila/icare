import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import Loader from "../Components/Loader";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const onStart = () => setLoading(true);
        const onFinish = () => setLoading(false);

        router.on("start", onStart);
        router.on("progress", onStart);
        router.on("finish", onFinish);
        router.on("success", onFinish);
        router.on("error", onFinish);

        return () => {
            router.off("start", onStart);
            router.off("progress", onStart);
            router.off("finish", onFinish);
            router.off("success", onFinish);
            router.off("error", onFinish);
        };
    }, []);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
            <Loader visible={loading} />
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
