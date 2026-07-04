import HistoryItem from '../HistoryItem/HistoryItem';
export default function HistoryList({ requests }) {
  return (
    <ul>
      {requests.map((item) => (
        <HistoryItem item={item} key={item.id} />
      ))}
    </ul>
  );
}
