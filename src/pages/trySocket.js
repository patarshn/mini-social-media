import { useEffect, useState } from "react";
import { getSocket } from "@/socket";
import { motion, AnimatePresence } from 'framer-motion';

export default function TrySocket() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const socket = getSocket();
    const [socketMessages, setSocketMessages] = useState([])

    useEffect(() => {

        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);
            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        function onTrySocket(message) {
            setSocketMessages(prevSocketMessages => [message, ...prevSocketMessages]);
            console.log('Message received by FE:', message);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("trySocket", onTrySocket);

        // socket.emit("trySocket", "Message from FE");

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("trySocket");
        };
    }, [socket]);


    return (
        <div>
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
            <p>Message</p>
            <div>
                <ul className="list-disc pl-5">
                    <AnimatePresence>
                        {socketMessages.map((socketMessage, index) => (
                            <motion.li
                                key={socketMessage}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="mb-1"
                            >
                                {socketMessage}
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </div>
        </div>
    );
}