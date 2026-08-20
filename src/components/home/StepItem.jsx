export default function StepItem({ number, title, children }) {
  return (
    <li className="step-item">
      <div className="step-number" aria-hidden="true">
        {number}
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </li>
  );
}
