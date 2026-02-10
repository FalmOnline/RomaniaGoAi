export default function Badge({ className = "", children }) {
  return (
    <p
      className={
        "shadow-md flex-row opacity-95 rounded-full px-3 py-1 inline-flex gap-2 items-center text-sm " +
        className
      }
    >
      {children}
    </p>
  );
}
