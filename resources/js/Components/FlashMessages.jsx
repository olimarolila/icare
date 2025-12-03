import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Alert from "./Alert";

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newMessages = [];

        if (flash?.success) {
            newMessages.push({
                type: "success",
                message: flash.success,
                id: Date.now() + 1,
            });
        }
        if (flash?.error) {
            newMessages.push({
                type: "danger",
                message: flash.error,
                id: Date.now() + 2,
            });
        }
        if (flash?.warning) {
            newMessages.push({
                type: "warning",
                message: flash.warning,
                id: Date.now() + 3,
            });
        }
        if (flash?.info) {
            newMessages.push({
                type: "info",
                message: flash.info,
                id: Date.now() + 4,
            });
        }

        if (newMessages.length > 0) {
            setMessages(newMessages);
        }
    }, [flash]);

    const handleDismiss = (id) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    if (messages.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {messages.map((msg) => (
                <Alert
                    key={msg.id}
                    variant={msg.type}
                    onClose={() => handleDismiss(msg.id)}
                    autoDismissMs={5000}
                    floating={true}
                    position="top-right"
                >
                    {msg.message}
                </Alert>
            ))}
        </div>
    );
}
