const LoadingScreen = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
    <img
      src="/src.png"
      alt="Streamrock Realty"
      className="h-16 w-auto mb-6 animate-pulse"
    />
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default LoadingScreen;
