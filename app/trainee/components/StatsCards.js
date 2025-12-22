export default function StatsCards({ certCount, courseCount, onCertificatesClick }) {
  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      <button
        onClick={onCertificatesClick}
        className="backdrop-blur-xl bg-white/5 p-6 rounded-xl text-center shadow-2xl hover:shadow-3xl hover:bg-green-500 hover:bg-opacity-10 transition cursor-pointer text-white"
      >
        <h3 className="text-xl font-semibold">Certificates</h3>
        <p className="text-3xl font-bold text-green-200 mt-2">{certCount}</p>
        <p className="text-xs text-white text-opacity-80 mt-2">Click to view</p>
      </button>

      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-xl text-center shadow-2xl text-white">
        <h3 className="text-xl font-semibold">Courses Enrolled</h3>
        <p className="text-3xl font-bold text-green-200 mt-2">{courseCount}</p>
      </div>
    </div>
  );
}