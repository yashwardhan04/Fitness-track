import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { getWorkoutsList, deleteWorkout, updateWorkout } from "../api";

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
  max-width: 1200px;
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
  grid-template-columns: 1.2fr 1fr 0.8fr 0.8fr 0.8fr 1fr 0.8fr;
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

const WorkoutHistory = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async (resetPage) => {
    const token = localStorage.getItem("fittrack-app-token");
    setLoading(true);
    try {
      const res = await getWorkoutsList(token, {
        page: resetPage ? 1 : page,
        limit: 50,                  // show more entries
        q: q?.trim() || undefined,  // don’t filter on empty string
      });
      setItems(res.data.items || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete workout?")) return;
    const token = localStorage.getItem("fittrack-app-token");
    try {
      await deleteWorkout(token, id);
      load();
    } catch {
      alert("Delete failed");
    }
  };

  const startEdit = (w) => {
    setEditingId(w._id);
    setEditForm({
      workoutName: w.workoutName || "",
      category: w.category || "",
      sets: w.sets ?? "",
      reps: w.reps ?? "",
      weight: w.weight ?? "",
      duration: w.duration ?? "",
      date: w.date ? new Date(w.date).toISOString().slice(0, 10) : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const token = localStorage.getItem("fittrack-app-token");
    setSaving(true);
    try {
      const payload = {
        workoutName: editForm.workoutName,
        category: editForm.category,
        sets: editForm.sets === "" ? undefined : parseInt(editForm.sets, 10),
        reps: editForm.reps === "" ? undefined : parseInt(editForm.reps, 10),
        weight: editForm.weight === "" ? undefined : parseFloat(editForm.weight),
        duration: editForm.duration === "" ? undefined : parseFloat(editForm.duration),
        date: editForm.date ? new Date(editForm.date) : undefined,
      };
      await updateWorkout(token, editingId, payload);
      await load();
      cancelEdit();
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Container>
      <Wrapper>
        <Title>Workout History</Title>
        <Controls>
          <input
            placeholder="Search by name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
          <Button text="Search" onClick={() => load(true)} isLoading={loading} />
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Button
              text="Prev"
              onClick={() => setPage(Math.max(1, page - 1))}
              isDisabled={page <= 1}
            />
            <Button text={`Page ${page}/${pages}`} onClick={() => {}} />
            <Button
              text="Next"
              onClick={() => setPage(Math.min(pages, page + 1))}
              isDisabled={page >= pages}
            />
          </div>
        </Controls>
        <Header>
          <div>Name</div>
          <div>Category</div>
          <div>Sets</div>
          <div>Reps</div>
          <div>Weight</div>
          <div>Date</div>
          <div>Actions</div>
        </Header>
        {items.map((w) => (
          <Row key={w._id}>
            <div>
              {editingId === w._id ? (
                <input
                  style={{ padding: 8, width: "100%" }}
                  value={editForm.workoutName}
                  onChange={(e) => setEditForm({ ...editForm, workoutName: e.target.value })}
                />
              ) : (
                w.workoutName
              )}
            </div>
            <div>
              {editingId === w._id ? (
                <input
                  style={{ padding: 8, width: "100%" }}
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                />
              ) : (
                w.category
              )}
            </div>
            <div>
              {editingId === w._id ? (
                <input
                  type="number"
                  style={{ padding: 8, width: "100%" }}
                  value={editForm.sets}
                  onChange={(e) => setEditForm({ ...editForm, sets: e.target.value })}
                />
              ) : (
                w.sets
              )}
            </div>
            <div>
              {editingId === w._id ? (
                <input
                  type="number"
                  style={{ padding: 8, width: "100%" }}
                  value={editForm.reps}
                  onChange={(e) => setEditForm({ ...editForm, reps: e.target.value })}
                />
              ) : (
                w.reps
              )}
            </div>
            <div>
              {editingId === w._id ? (
                <input
                  type="number"
                  step="0.01"
                  style={{ padding: 8, width: "100%" }}
                  value={editForm.weight}
                  onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                />
              ) : (
                w.weight
              )}
            </div>
            <div>
              {editingId === w._id ? (
                <input
                  type="date"
                  style={{ padding: 8, width: "100%" }}
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              ) : (
                new Date(w.date).toLocaleDateString()
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {editingId === w._id ? (
                <>
                  <Button text={saving ? "Saving..." : "Save"} onClick={saveEdit} isDisabled={saving} />
                  <Button text="Cancel" outlined onClick={cancelEdit} isDisabled={saving} />
                </>
              ) : (
                <>
                  <Button text="Edit" outlined onClick={() => startEdit(w)} />
                  <Button text="Delete" outlined onClick={() => onDelete(w._id)} />
                </>
              )}
            </div>
          </Row>
        ))}
        {items.length === 0 && !loading && (
          <div style={{ padding: 20 }}>No workouts found.</div>
        )}
      </Wrapper>
    </Container>
  );
};

export default WorkoutHistory;
