import { message } from "antd";
import { useState } from "react";

export function useSubscribe() {
  const [email, setEmail] = useState("");
  const subscribe = () => {
    // check email value if null and email
    if (
      !email ||
      !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      message.error("Invalid Email!");
      return;
    }
    const formData = new FormData();
    formData.append("entry.634050656", email);

    fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLScil1B1VTKLFBrmroSfxhp0PtoQIa1SOHl7jH6kTCoAWS_L2A/formResponse",
      {
        method: "POST",
        body: formData,
        mode: "no-cors",
      },
    )
      .then(() => {
        message.success("Subscribe Successfully!");
        setEmail("");
      })
      .catch((error) => {
        message.error("Subscribe Failed!");
        console.error("Subscribe Failed", error);
      });
  };
  return {
    email,
    setEmail,
    subscribe,
  };
}
