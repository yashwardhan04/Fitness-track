import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import { sendContactMessage } from "../api";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
`;
const Title = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;
const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.shadow};
  border-radius: 12px;
  padding: 20px;
`;

const Contact = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const validate = () => {
    if (!subject || subject.trim().length < 3) {
      alert("Subject must be at least 3 characters");
      return false;
    }
    if (!message || message.trim().length < 10) {
      alert("Message must be at least 10 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setDisabled(true);
    const token = localStorage.getItem("fittrack-app-token");
    try {
      await sendContactMessage(token, {
        subject: subject.trim(),
        message: message.trim(),
        // backend will also associate user; name/email sent for convenience
        name: currentUser?.name,
        email: currentUser?.email,
      });
      alert("Thanks! Your message has been sent.");
      setSubject("");
      setMessage("");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Contact Support</Title>
        <Form>
          <TextInput
            label="Name"
            placeholder="Your name"
            value={currentUser?.name || ""}
            handelChange={() => {}}
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={currentUser?.email || ""}
            handelChange={() => {}}
          />
          <TextInput
            label="Subject"
            placeholder="What can we help you with?"
            value={subject}
            handelChange={(e) => setSubject(e.target.value)}
          />
          <TextInput
            label="Message"
            placeholder="Describe your issue or feedback"
            textArea
            rows={6}
            value={message}
            handelChange={(e) => setMessage(e.target.value)}
          />
          <Button
            text="Send Message"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={disabled}
          />
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Contact;