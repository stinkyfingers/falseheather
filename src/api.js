export const getEvents = async () => {
  const resp = await fetch('https://sugarrush.appspot.com/heather');
  const events = await resp.json()
  return events.sort((first, second) => {
    const f = new Date(first.start.dateTime);
    const s = new Date(second.start.dateTime);
    if (f < s) return -1;
    if (f > s) return 1;
    return 0;
  });
};
