function Stars({ value = 0 }) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      ★★★★★
      <span className="stars-fill" style={{ width: `${percent}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

export default Stars;