import dayjs from "dayjs";
import WeekDay from "dayjs/plugin/weekday";
dayjs.extend(WeekDay);

export const getSunday = () => {
  return dayjs().weekday(7);
};

export const getMonday = () => {
  return dayjs().weekday(1);
};

export const sortLatest = (sessions) => {
  return sessions.sort(function (a, b) {
    return new Date(b.updated_at) - new Date(a.updated_at)
  })
}

export const getThisWeekSessions = (sessions) => {
  const monday = dayjs().weekday(1).format("D");
  const sunday = dayjs().weekday(7).format("D");

  const weeksSessions = sessions.filter(
    (session) =>
      dayjs(session.created_at).format("D") >= monday &&
      dayjs(session.created_at).format("D") <= sunday
  );

  return weeksSessions;
};

export const getTodaysSessions = (sessions) => {
  const today = dayjs().format("D");

  const todaySessions = sessions.filter(
    (session) => dayjs(session.created_at).format("D") === today
  );

  return todaySessions;
};

export const getThisMonthsSessions = (sessions) => {
  const currentMonth = dayjs().format("MM");

  const todaySessions = sessions.filter(
    (session) => dayjs(session.created_at).format("MM") === currentMonth
  );

  return todaySessions;
};
