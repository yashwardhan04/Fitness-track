import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignUp } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";
import { NavLink } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;
const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

// Styled controls to match app theme and TextInput labeling
const FieldGroup = styled.div`
  margin: 8px 0 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const FieldLabel = styled.label`
  font-size: 12px;
  color: ${({ theme }) => theme.text_primary};
  padding: 0 4px;
`;
const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;
const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  input {
    accent-color: ${({ theme }) => theme.primary};
  }
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState("user");

  const user = JSON.parse(localStorage.getItem("fittrack-user") || "{}");

  const validateInputs = () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handelSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);

    if (validateInputs()) {
      try {
        const res = await UserSignUp({ name, email, password, profileType });

        if (!res || !res.data) {
          throw new Error("Invalid response from server");
        }

        dispatch(loginSuccess(res.data));
        alert("Account Created Success");
      } catch (err) {
        console.error(err);
        const msg = err?.response?.data?.message || "Signup failed";
        alert(msg);
      } finally {
        setLoading(false);
        setButtonDisabled(false);
      }
    } else {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handelSignUp();
  };

  return (
    <Container>
      <div>
        <Title>Create New Account 👋</Title>
        <Span>Please enter details to create a new account</Span>
      </div>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Full name"
          placeholder="Enter your full name"
          value={name}
          handelChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
        />
        <FieldGroup>
          <FieldLabel>Profile Type</FieldLabel>
          <RadioGroup>
            <RadioOption>
              <input
                type="radio"
                value="user"
                checked={profileType === "user"}
                onChange={() => setProfileType("user")}
              />
              <span>User</span>
            </RadioOption>
            <RadioOption>
              <input
                type="radio"
                value="admin"
                checked={profileType === "admin"}
                onChange={() => setProfileType("admin")}
              />
              <span>Admin</span>
            </RadioOption>
          </RadioGroup>
        </FieldGroup>
        <Button
          text="SignUp"
          onClick={handelSignUp}
          isLoading={loading}
          isDisabled={buttonDisabled}
        />
      </form>
      {user.profileType === "admin" && (
        <NavLink to="/my-messages">My Messages</NavLink>
      )}
    </Container>
  );
};

export default SignUp;
