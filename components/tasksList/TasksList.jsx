"use client";
import { useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  updateDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";

import { Backdrop, Checkbox, CircularProgress, Grid } from "@mui/material";

import { Msg, logStatus, Dark } from "@/helper/Contexts";

import styles from "./TasksList.module.css";

export default function TasksList() {
  const route = useRouter();

  const { setMsg } = useContext(Msg);
  const { loggedIn } = useContext(logStatus);
  const { darkMode } = useContext(Dark);

  const [tasksList, setTasksList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Check If user logged in
    if (!loggedIn) {
      //Redirect to landing page
      route.push("/");
    } else {
      //Get tasks list from server
      getDocs(collection(db, "tasks"))
        .then((data) => {
          const list = data.docs.filter(
            (doc) => doc.data().uid == auth.currentUser.uid
          );

          const dataList = list.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          //sort list based on creation time
          dataList.sort((a, b) => b.order - a.order);
          setLoading(false);
          setTasksList(dataList);
        })
        .catch((err) => {
          setLoading(false);
          route.push("/");
          setMsg({
            open: true,
            message: err.message,
            type: "error",
          });
        });
    }
  }, [loggedIn]);

  const checked = (task) => {
    setLoading(true);
    const taskRef = doc(db, "tasks", task.id);
    const newTask = task;
    task.done = true;
    updateDoc(taskRef, { ...newTask })
      .then(() => {
        setTasksList((prev) => {
          const newArr = prev.map((taskInstance) => {
            if (taskInstance.id === task.id) {
              return task;
            }
            return taskInstance;
          });
          return newArr;
        });
        setLoading(false);
        setMsg({
          open: true,
          message: "Done!",
          type: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        setMsg({
          open: true,
          message: err.message,
          type: "error",
        });
      });
  };

  const deleteTask = (id) => {
    setLoading(true);
    const taskDoc = doc(db, "task", id);

    deleteDoc(taskDoc)
      .then(() => {
        setTasksList((prev) => {
          const newArr = prev.filter((task) => task.id !== id);
          return newArr;
        });
        setLoading(false);
        setMsg({
          open: true,
          message: "Task removed!",
          type: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        setMsg({
          open: true,
          message: err.message,
          type: "error",
        });
      });
  };

  const done = tasksList.filter((task) => task.done);
  const progress = tasksList.filter((task) => !task.done);

  return (
    <div className={`container ${darkMode ? "darkShadow" : "lightShadow"}`}>
      <div className="header">
        <h1>Tasks List</h1>
        <div onClick={route.back} className="backBtn">
          Back
        </div>
      </div>
      {loading && (
        <div className="center">
          <CircularProgress />
        </div>
      )}

      <Grid container justifyContent="space-between" alignItems="flex-start">
        <Grid
          item
          xs={12}
          md={5}
          spacing={2}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={` ${darkMode ? "darkShadow" : "lightShadow"}`}
        >
          <Grid item xs={12} className={styles.colTitle}>
            In Progress Tasks
          </Grid>
          {progress.map((task) => (
            <Grid
              key={task.id}
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
              className={`${styles.task} ${!darkMode && styles.lightTask}`}
            >
              {task.title}
              <Checkbox
                onChange={() => checked(task)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          spacing={2}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={`${darkMode ? "darkShadow" : "lightShadow"}`}
        >
          <Grid item xs={12} className={styles.colTitle}>
            Done
          </Grid>
          {done.map((task) => (
            <Grid
              key={task.id}
              item
              container
              justifyContent="space-between"
              alignItems="center"
              xs={12}
              className={`${styles.task} ${!darkMode && styles.lighttask}`}
            >
              {task.title}
              <Checkbox checked inputProps={{ "aria-label": "controlled" }} />
              <div onClick={() => deleteTask(task.id)} className="backBtn">
                Delete
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
