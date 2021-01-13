import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import dayjs from "dayjs";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import {
  getTodaysSessions,
  getThisWeekSessions,
  getThisMonthsSessions,
} from "./selectors";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <div className="tab-panel-box">{children}</div>}
    </div>
  );
};

const App = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [count, setCount] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSession, setNewSession] = useState(false);
  const [allSessions, setSessions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [name, setName] = useState("");
  const timerRef = useRef();
  const sessionsToday = getTodaysSessions(allSessions);
  const weeksSessions = getThisWeekSessions(allSessions);
  const monthsSessions = getThisMonthsSessions(allSessions);

  useEffect(() => {
    setIsLoading(true);
    const url = "http://localhost:8010/sessions";
    axios.get(url).then((sessions) => {
      const aSessions = sessions.data;
      setIsLoading(false);
      setSessions(aSessions);
      console.log(aSessions);
    });
  }, [setIsLoading]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCancel = () => {
    setCount(0);
    setName("");
    setNewSession(false);
    setStopped(false);
  };

  const handleSave = () => {
    const url = "http://localhost:8010/session";
    const body = {
      name,
      time: count,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    axios.post(url, body, { headers }).then((session) => {

    });

    handleCancel();
  };

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const createNewSession = () => {
    setIsEditing(true);
    setNewSession(true);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setTimeout(() => {
        setCount(count + 1);
      }, 1000);
    }
  });

  const pauseTimer = () => {
    setIsRunning(false);
    clearTimeout(timerRef.current);
  };

  const stopTimer = () => {
    setStopped(true);
    setIsRunning(false);
    clearTimeout(timerRef.current);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    time %= 3600;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date) => {
    return dayjs(date).format("MM-DD-YYYY");
  };

  const getAllSessions = () => {
    return allSessions.length > 0
      ? allSessions.map((session) => (
          <div className="session-card">
            <div className="date-display">{formatDate(session.created_at)}</div>
            <div className="session-card-title">{session.name}</div>
            <div className="session-card-time">{formatTime(session.time)}</div>
          </div>
        ))
      : null;
  };

  const getSessionsToday = () => {
    return sessionsToday.length > 0
      ? sessionsToday.map((session) => (
          <div className="session-card">
            <div className="date-display">{formatDate(session.created_at)}</div>
            <div className="session-card-title">{session.name}</div>
            <div className="session-card-time">{formatTime(session.time)}</div>
          </div>
        ))
      : null;
  };

  const getWeekSessions = () => {
    return weeksSessions.length > 0
      ? weeksSessions.map((session) => (
          <div className="session-card">
            <div className="date-display">{formatDate(session.created_at)}</div>
            <div className="session-card-title">{session.name}</div>
            <div className="session-card-time">{formatTime(session.time)}</div>
          </div>
        ))
      : null;
  };

  const getMonthSessions = () => {
    return monthsSessions.length > 0
      ? monthsSessions.map((session) => (
          <div className="session-card">
            <div className="date-display">{formatDate(session.created_at)}</div>
            <div className="session-card-title">{session.name}</div>
            <div className="session-card-time">{formatTime(session.time)}</div>
          </div>
        ))
      : null;
  };

  const getTotalTime = (sessions) => {
    let total = 0;
    sessions.map((session) => (total += session.time));
    return total;
  };

  return isLoading ? (
    <div>...</div>
  ) : (
    <div className="container">
      <div className="top-section">
        <h1 className="page-title">Time Tracker</h1>
        <Button variant="contained" color="primary" onClick={createNewSession}>
          New Session
        </Button>
      </div>
      {newSession && (
        <div className="current-session-section">
          <div className="session-card">
            {isEditing ? (
              <div className="input-wrap">
                <input
                  type="text"
                  className="name-input"
                  name="name"
                  placeholder="Session Name"
                  onChange={handleInputChange}
                  value={name}
                />
                <DoneIcon
                  classes={{ root: "icons-style" }}
                  onClick={() => setIsEditing(false)}
                />
              </div>
            ) : (
              <>
                <div className="session-card-title">
                  {name}{" "}
                  <EditIcon
                    fontSize="small"
                    classes={{ root: "icons-style" }}
                    onClick={() => setIsEditing(true)}
                  />
                </div>
              </>
            )}
            <div className="session-card-time">{formatTime(count)}</div>
            <div className="session-card-button">
              {stopped ? (
                <>
                  <Button
                    className="button-margin-right"
                    variant="contained"
                    color="secondary"
                    onClick={handleCancel}
                  >
                    Discard
                  </Button>
                  {count > 0 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    className="margin-right"
                    color="primary"
                    onClick={
                      isRunning ? () => pauseTimer() : () => setIsRunning(true)
                    }
                  >
                    {isRunning ? "Pause" : "Start"}
                  </Button>
                  {count > 0 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => stopTimer(true)}
                    >
                      Stop
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="overview-section">
        <Paper className={classes.root}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Today" />
            <Tab label="This Week" />
            <Tab label="This Month" />
            <Tab label="All" />
          </Tabs>
        </Paper>
        <TabPanel value={value} index={0}>
          <div className="overview-panel">
            <div className="overview-item">
              Total Time:{" "}
              <span className="total-time">
                {formatTime(getTotalTime(sessionsToday))}
              </span>
            </div>
          </div>
          <div className="sessions-wrap">
            <div className="sessions-container">{getSessionsToday()}</div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className="overview-panel">
            <div className="overview-item">
              Total Time:{" "}
              <span className="total-time">
                {formatTime(getTotalTime(weeksSessions))}
              </span>
            </div>
          </div>
          <div className="sessions-wrap">
            <div className="sessions-container">{getWeekSessions()}</div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div className="overview-panel">
            <div className="overview-item">
              Total Time:{" "}
              <span className="total-time">
                {formatTime(getTotalTime(monthsSessions))}
              </span>
            </div>
          </div>
          <div className="sessions-wrap">
            <div className="sessions-container">{getMonthSessions()}</div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <div className="overview-panel">
            <div className="overview-item">
              Total Time:{" "}
              <span className="total-time">
                {formatTime(getTotalTime(allSessions))}
              </span>
            </div>
          </div>
          <div className="sessions-wrap">
            <div className="sessions-container"> {getAllSessions()}</div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default App;
