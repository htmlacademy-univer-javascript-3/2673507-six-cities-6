function Spinner(): JSX.Element {
  return (
    <div className="spinner" style={{ padding: '50px', textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #4481c3',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ marginTop: '16px' }}>Loading...</p>
    </div>
  );
}

export default Spinner;
