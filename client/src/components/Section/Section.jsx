export function Section({ title, onShowForm, onRemoveSection }) {
  return (
    <li>
      {title}
      <button onClick={onShowForm}>ред</button>
      <button onClick={onRemoveSection}>-</button>
    </li>
  );
}
