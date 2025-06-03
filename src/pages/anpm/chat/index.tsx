import BalanceSection from "../components/BalanceSection";
import { useState } from "react";
import { Input, Spin, message } from "antd";
import { useActiveAddress, useConnection } from "arweave-wallet-kit";
import { useLocalStorage } from "react-use";
import { useAutoScroll } from "../../../utils/react-use";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addTask, getTask } from "../contexts/request";
import dayjs from "dayjs";
import { sendIcon } from "../assets";

type ChatItem = {
    role: 'user' | 'assistant' | 'tip';
    message: string;
    reference: string | null;
    timestamp: number;
}

const DEFAULT_CHAT: ChatItem[] = [
    {
        role: "tip",
        message: "Hi, I'm Qwen! Please type your question into the text box below. Enjoy!",
        reference: null,
        timestamp: dayjs().valueOf(),
    },
]

const Playground = () => {
    const activeAddress = useActiveAddress();
    const { connect } = useConnection();

    const [chatHistoryStor, setChatHistory] = useLocalStorage<ChatItem[]>("anpm-chat-session", DEFAULT_CHAT);
    const chatHistory = chatHistoryStor || DEFAULT_CHAT;

    const [prompt, setPrompt] = useState<string>();

    const latestRef = chatHistory[chatHistory.length - 1].reference;

    const refresh = async (ref: string) => {
        const task = await getTask(latestRef || "")
        if (task) {
            switch (task.status) {
                case "pending":
                    setChatHistory(chatHistory.concat({
                        role: "tip",
                        message: "Your question is queued. Refresh in 5s...",
                        reference: ref,
                        timestamp: dayjs().valueOf(),
                    }))
                    break;
                case "processing":
                    setChatHistory(chatHistory.concat({
                        role: "tip",
                        message: "Your question is being processed. Refresh in 5s...",
                        reference: ref,
                        timestamp: dayjs().valueOf(),
                    }))
                    break;
                case "done":
                    setChatHistory(chatHistory.concat({
                        role: "assistant",
                        message: task.output || "",
                        reference: null,
                        timestamp: dayjs().valueOf(),
                    }))
            }
        }
        return task;
    }

    const getTaskQuery = useQuery({
        queryKey: ["getTask", latestRef],
        queryFn: () => refresh(latestRef || ""),
        refetchInterval: 5000,
        enabled: () => !!latestRef,
    })
    const addTaskMutation = useMutation({
        mutationFn: () => addTask(prompt || ""),
        onSuccess: async (ref) => {
            setChatHistory(chatHistory.concat([
                {
                    role: "user",
                    message: prompt || "",
                    reference: ref,
                    timestamp: dayjs().valueOf(),
                },
                {
                    role: "tip",
                    message: "Your question is sent. Please wait for the answer...",
                    reference: ref,
                    timestamp: dayjs().valueOf(),
                }
            ]))
            getTaskQuery.refetch();
            setPrompt("");
        },
        onError: (e) => {
            message.error(e.message);
        },
    });

    const scrollRef = useAutoScroll();
    return (
        <div>
            <div className="mb-3 w-[680px] h-[385px] p-6 rounded-lg border-1 border-solid border-[#ebebeb] bg-white overflow-y-auto scroll-smooth" ref={scrollRef}>
                {chatHistory.map(({ role, message }, index) => {
                    if (role === "tip") {
                        return (
                            <div key={index} className="text-xs text-center text-gray-400">
                                --- {message} ---
                            </div>
                        )
                    }
                    return (
                        <div key={index} className={`flex gap-2 ${role === "user" ? "flex-row-reverse justify-start" : ""}`}>
                            <div
                                className={`max-w-[60%] rounded-lg p-4 font-medium text-base leading-normal my-4 bg-[#f2f2f2] border-1 border-solid border-[#e5e7eb] text-[#262626]`}
                            >
                                {message}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div
                className="w-[680px] relative p-6 rounded-lg border-1 border-solid border-[#ebebeb] bg-white"
            >
                <Input.TextArea
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                    }}
                    disabled={getTaskQuery.isFetching || addTaskMutation.isPending}
                    placeholder="Enter prompt here"
                    style={{
                        paddingRight: "20%",
                        borderWidth: 0,
                    }}
                />
                <div className={`absolute right-8 bottom-6`}>
                    <Spin spinning={getTaskQuery.isFetching || addTaskMutation.isPending}>
                        <img src={sendIcon} className="w-[30px] h-[30px]" onClick={() => {
                            if (getTaskQuery.isFetching || addTaskMutation.isPending) return;
                            if (!activeAddress) {
                                connect();
                                return;
                            }
                            if (!prompt?.trim().length) {
                                message.warning("Please enter a prompt");
                                return
                            }
                            addTaskMutation.mutate();
                        }} />
                    </Spin>
                </div>
            </div>
        </div>
    );
};



export function Component() {
    return (
        <main className="pt-[210px] pb-[90px] bg-[#F9FAFB]">
            <div className="max-w-[1200px] mx-auto p-5 flex gap-10">
                <div className="w-[250px]">
                    <BalanceSection />
                </div>
                <div className="flex-1 space-y-10">
                    <Playground />
                </div>
            </div>
        </main>
    );
}
