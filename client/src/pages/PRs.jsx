import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { listPRs, createPR, deletePRApi } from "../api";

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
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px;
`;
const Title = styled.div`
  font-size: 22px;
  font-weight: 600;
`;
const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  border-radius: 12px;
  padding: 16px;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.9fr 0.8fr 0.8fr 1.1fr;
  gap: 10px;
  padding: 10px 8px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.shadow};
`;
const Header = styled(Row)`
  font-weight: 600;
  background: ${({ theme }) => theme.card};
  position: sticky;
  top: 0;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  width: 100%;
`;
const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  width: 100%;
`;

const PRs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ exercise: "", metric: "weight", value: "", unit: "kg" });

  const load = async () => {
    const token = localStorage.getItem("fittrack-app-token");
    setLoading(true);
    try {
      const res = await listPRs(token, {});
      setItems(res.data || []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load PRs");
    } finally {
      setLoading(false);
    }
  };

  const add = async () => {
    const token = localStorage.getItem("fittrack-app-token");
    if (!form.exercise || form.value === "") {
      alert("Please enter exercise and value");
      return;
    }
    try {
      const payload = {
        exercise: form.exercise,
        metric: form.metric,
        value: parseFloat(form.value),
        unit: form.unit,
      };
      await createPR(token, payload);
      setForm({ exercise: "", metric: form.metric, value: "", unit: form.unit });
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to create PR");
    }
  };

  const onDelete = async (id) => {
    const token = localStorage.getItem("fittrack-app-token");
    if (!window.confirm("Delete this PR?")) return;
    try {
      await deletePRApi(token, id);
      load();
    } catch (e) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Personal Records</Title>
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr auto", gap: 10 }}>
            <Input
              placeholder="Exercise (e.g., Bench Press)"
              value={form.exercise}
              onChange={(e) => setForm({ ...form, exercise: e.target.value })}
            />
            <Select value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })}>
              <option value="weight">Weight</option>
              <option value="reps">Reps</option>
              <option value="duration">Duration</option>
            </Select>
            <Input
              type="number"
              step="0.01"
              placeholder="Value"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
            <Input
              placeholder="Unit (kg, reps, min)"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
            <Button text="Add PR" onClick={add} isLoading={loading} />
          </div>
        </Card>

        <Card>
          <Header>
            <div>Exercise</div>
            <div>Metric</div>
            <div>Value</div>
            <div>Unit</div>
            <div>Actions</div>
          </Header>
          {items.map((pr) => (
            <Row key={pr._id}>
              <div>{pr.exercise}</div>
              <div>{pr.metric}</div>
              <div>{pr.value}</div>
              <div>{pr.unit}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button text="Delete" outlined onClick={() => onDelete(pr._id)} />
              </div>
            </Row>
          ))}
          {items.length === 0 && <div style={{ padding: 12 }}>No PRs yet.</div>}
        </Card>
      </Wrapper>
    </Container>
  );
};

export default PRs;


