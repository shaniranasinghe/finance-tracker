import dayjs from 'dayjs';
// dateUtils.js
export const calculateNextNotificationDate = (currentDate, recurrencePattern) => {
  const nextDate = new Date(currentDate);

  switch (recurrencePattern) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      throw new Error('Invalid recurrence pattern');
  }

  return nextDate;
};
