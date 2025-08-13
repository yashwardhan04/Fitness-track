import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { getMyContacts, updateContactStatus } from "../api";

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
const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.8fr 1fr 1.2fr;
  gap: 10px;
  padding: 12px 10px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.shadow};
`;
const Header = styled(Row)`
  font-weight: 600;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.card};
  z-index: 1;
`;
const Controls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const MyMessages = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async (resetPage) => {
    const token = localStorage.getItem("fittrack-app-token");
    setLoading(true);
    try {
      const res = await getMyContacts(token, {
        page: resetPage ? 1 : page,
        limit: 10,
        status: status || undefined,
      });
      setItems(res.data.items || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch {
      alert("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const setStatusFor = async (id, next) => {
    const token = localStorage.getItem("fittrack-app-token");
    try {
      await updateContactStatus(token, id, next);
      load();
    } catch {
      alert("Status update failed");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Container>
      <Wrapper>
        <Title>My Messages</Title>
        <Controls>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="closed">Closed</option>
          </select>
          <Button text="Filter" onClick={() => load(true)} isLoading={loading} />
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Button text="Prev" onClick={() => setPage(Math.max(1, page - 1))} isDisabled={page <= 1} />
            <Button text={`Page ${page}/${pages}`} onClick={() => {}} />
            <Button text="Next" onClick={() => setPage(Math.min(pages, page + 1))} isDisabled={page >= pages} />
          </div>
        </Controls>
        <Header>
          <div>Subject</div>
          <div>Status</div>
          <div>Date</div>
          <div>Actions</div>
        </Header>
        {items.map((m) => (
          <Row key={m._id}>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {m.subject}
            </div>
            <div style={{ textTransform: "capitalize" }}>{m.status}</div>
            <div>{new Date(m.createdAt).toLocaleString()}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {m.status !== "read" && (
                <Button text="Mark Read" outlined onClick={() => setStatusFor(m._id, "read")} />
              )}
              {m.status !== "closed" && (
                <Button text="Close" outlined onClick={() => setStatusFor(m._id, "closed")} />
              )}
            </div>
          </Row>
        ))}
        {items.length === 0 && !loading && <div style={{ padding: 20 }}>No messages found.</div>}
      </Wrapper>
    </Container>
  );
};

export default MyMessages;
