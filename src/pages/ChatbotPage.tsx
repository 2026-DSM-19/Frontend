import { useState } from "react";
import styled from "@emotion/styled";

const Page = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #f5f7fb;
`;

const ChatbotContainer = styled.div`
  width: 700px;
  height: 750px;

  background: white;

  border-radius: 24px;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
`;

const ChatHeader = styled.div`
  height: 90px;

  padding: 0 30px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  border-bottom: 1px solid #eee;
`;

const HeaderLeft = styled.div`
  display: flex;

  align-items: center;

  gap: 15px;
`;

const BackButton = styled.button`
  border: none;

  background: #edf4ff;

  color: #12365c;

  width: 40px;

  height: 40px;

  border-radius: 50%;

  cursor: pointer;

  font-size: 18px;

  &:hover {
    background: #12365c;

    color: white;
  }
`;

const HeaderTitle = styled.div`
  h2 {
    margin: 0;

    color: #12365c;

    font-size: 24px;
  }

  p {
    margin-top: 6px;

    color: #777;

    font-size: 14px;
  }
`;

const Status = styled.div`
  color: #25b879;

  font-weight: bold;
`;

const ChatArea = styled.div`
  flex: 1;

  background: #f7f9fc;

  padding: 30px;

  overflow-y: auto;
`;

const Message = styled.div`
  display: flex;

  gap: 12px;

  align-items: flex-start;

  margin-bottom: 20px;

  &.user {
    flex-direction: row-reverse;

    div:last-child {
      background: #12365c;

      color: white;
    }
  }
`;

const Icon = styled.div`
  width: 42px;

  height: 42px;

  border-radius: 50%;

  background: #12365c;

  color: white;

  display: flex;

  justify-content: center;

  align-items: center;
`;

const Bubble = styled.div`
  max-width: 450px;

  background: white;

  padding: 15px 20px;

  border-radius: 18px;

  line-height: 1.5;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Recommend = styled.div`
  padding: 20px;

  display: flex;

  gap: 10px;

  flex-wrap: wrap;
`;

const RecommendButton = styled.button`
  border: none;

  background: #edf4ff;

  color: #12365c;

  padding: 10px 15px;

  border-radius: 20px;

  cursor: pointer;

  &:hover {
    background: #12365c;

    color: white;
  }
`;

const InputArea = styled.div`
  display: flex;

  gap: 10px;

  padding: 20px;

  border-top: 1px solid #eee;
`;

const Input = styled.input`
  flex: 1;

  height: 50px;

  border: none;

  outline: none;

  background: #f3f6fa;

  border-radius: 12px;

  padding: 0 15px;
`;

const SendButton = styled.button`
  width: 55px;

  border: none;

  border-radius: 12px;

  background: #12365c;

  color: white;

  font-size: 20px;

  cursor: pointer;
`;

interface ChatMessage {
  sender: "bot" | "user";
  text: string;
}

function Chatbot() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "안녕하세요 👋\nSafe Scope AI입니다.\n주소를 입력하면 주변 위험 정보를 분석해드립니다.",
    },
  ]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 사용자 메시지 추가
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
      },
    ]);

    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: text,
        }),
      });

      const res = await response.json();

      // 챗봇 응답 추가
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.message,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Page>
      <ChatbotContainer>
        <ChatHeader>
          <HeaderLeft>
            <BackButton onClick={() => window.history.back()}>←</BackButton>

            <HeaderTitle>
              <h2>🤖 Safe Scope AI</h2>

              <p>주소 주변 위험 정보를 분석해드립니다.</p>
            </HeaderTitle>
          </HeaderLeft>

          <Status>● Online</Status>
        </ChatHeader>

        <ChatArea>
          {messages.map((msg, index) => (
            <Message
              key={index}
              className={msg.sender === "user" ? "user" : ""}
            >
              <Icon>{msg.sender === "bot" ? "🤖" : "👤"}</Icon>

              <Bubble>
                {msg.text.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </Bubble>
            </Message>
          ))}
        </ChatArea>

        <Recommend>
          <RecommendButton onClick={() => sendMessage("이 주소 안전한가요?")}>
            이 주소 안전한가요?
          </RecommendButton>

          <RecommendButton onClick={() => sendMessage("CCTV 확인해주세요")}>
            CCTV 확인
          </RecommendButton>

          <RecommendButton
            onClick={() => sendMessage("범죄 위험 확인해주세요")}
          >
            범죄 위험 확인
          </RecommendButton>

          <RecommendButton
            onClick={() => sendMessage("침수 위험 확인해주세요")}
          >
            침수 위험 확인
          </RecommendButton>
        </Recommend>

        <InputArea>
          <Input
            value={input}
            placeholder="주소 또는 질문을 입력하세요"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(input);
              }
            }}
          />

          <SendButton onClick={() => sendMessage(input)}>➤</SendButton>
        </InputArea>
      </ChatbotContainer>
    </Page>
  );
}

export default Chatbot;
