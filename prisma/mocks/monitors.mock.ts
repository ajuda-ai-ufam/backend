import { MonitorStatus } from 'src/monitor/utils/monitor.enum';

export const monitors = [
  {
    monitorData: {
      id: 1,
      id_status: MonitorStatus.PENDING,
      responsible_professor_id: 2,
      student_id: 9,
      subject_id: 1,
    },
    availableTimes: [],
  },
  {
    monitorData: {
      id: 2,
      id_status: MonitorStatus.AVAILABLE,
      responsible_professor_id: 2,
      student_id: 6,
      subject_id: 2,
    },
    availableTimes: [
      {
        id: 1,
        week_day: 0,
        start: '00:00',
        end: '23:00',
        monitor_id: 2,
      },
      {
        id: 2,
        week_day: 1,
        start: '00:00',
        end: '23:00',
        monitor_id: 2,
      },
      {
        id: 3,
        week_day: 2,
        start: '00:00',
        end: '23:00',
        monitor_id: 2,
      },
      {
        id: 4,
        week_day: 3,
        start: '00:00',
        end: '23:00',
        monitor_id: 2,
      },
      {
        id: 5,
        week_day: 4,
        start: '00:00',
        end: '23:00',
        monitor_id: 2,
      },
      {
        id: 6,
        week_day: 5,
        start: '00:00',
        end: '23:00',
        monitor_id: 2,
      },
      {
        id: 7,
        week_day: 6,
        start: '00:00',
        end: '23:00',
        monitor_id: 2,
      },
    ],
  },
  {
    monitorData: {
      id: 3,
      id_status: MonitorStatus.DONE,
      responsible_professor_id: 2,
      student_id: 7,
      subject_id: 1,
    },
    availableTimes: [],
  },
  {
    monitorData: {
      id: 4,
      id_status: MonitorStatus.REJECTED,
      responsible_professor_id: 2,
      student_id: 7,
      subject_id: 2,
    },
    availableTimes: [],
  },
  {
    monitorData: {
      id: 5,
      id_status: MonitorStatus.AVAILABLE,
      responsible_professor_id: 3,
      student_id: 7,
      subject_id: 1,
    },
    availableTimes: [
      {
        id: 8,
        week_day: 0,
        start: '12:00',
        end: '14:00',
        monitor_id: 5,
      },
    ],
  },
  {
    monitorData: {
      id: 6,
      id_status: MonitorStatus.APPROVED,
      responsible_professor_id: 2,
      student_id: 8,
      subject_id: 1,
    },
    availableTimes: [],
  },
];
