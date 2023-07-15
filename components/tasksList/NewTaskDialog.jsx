"use client";
import { useContext, useState } from "react";

import {
  Button,
  TextField,
  DialogContent,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";

import { auth, db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

import { Msg } from "@/components/helper/Contexts";

export default function NewTaskDialog({ max, getList, setLoading }) {
  const { setMsg } = useContext(Msg);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const tasksCollectionRef = collection(db, "tasks");

  const createNewTask = () => {
    if (title) {
      setOpen(false);
      setLoading(true);
      addDoc(tasksCollectionRef, {
        title: title,
        order: max,
        uid: auth.currentUser.uid,
        done: false,
      })
        .then(() => {
          setMsg({
            open: true,
            message: "New task added!",
            type: "success",
          });
          getList();
        })
        .catch((err) => {
          setLoading(false);
          setMsg({
            open: true,
            message: err.message,
            type: "error",
          });
        });
    } else {
      setMsg({
        open: true,
        message: "Title should not be empty",
        type: "error",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="backBtn" onClick={() => setOpen(true)}>
        Create New Task
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={createNewTask}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
