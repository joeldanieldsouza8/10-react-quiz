// This is a presentational component that displays a loading animation.
export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Loading questions...</p>
    </div>
  );
}
