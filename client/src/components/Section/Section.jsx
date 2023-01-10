export function Section({ title, onShowForm, onRemoveSection }) {
  return (
    <li className="section__item">
      {title}
      <button onClick={onShowForm}>ред</button>
      <button onClick={onRemoveSection}>-</button>
    </li>
  );
}
