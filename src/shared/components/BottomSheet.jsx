function BottomSheet({ onClose, children, radius = "rounded-t-[28px]", handleColor = "bg-[#e5e7eb]" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        className={`w-[393px] max-w-full bg-white px-6 pb-8 pt-4 ${radius}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`mx-auto mb-4 h-1 w-9 rounded-sm ${handleColor}`} />
        {children}
      </div>
    </div>
  );
}

export default BottomSheet;
