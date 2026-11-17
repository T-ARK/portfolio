export default function BackToTop({ visible }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`back-top ${visible ? 'visible' : ''}`}
      id="backTop"
      aria-label="Back to top"
      onClick={scrollToTop}
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}
