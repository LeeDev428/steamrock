const LoadingScreen = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
    <img
      src="/src.png"
      alt="Streamrock Realty"
      className="h-16 w-auto mb-8"
    />
    {/* Line loading animation */}
    <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-loading-line" />
    </div>
  </div>
);

export default LoadingScreen;
