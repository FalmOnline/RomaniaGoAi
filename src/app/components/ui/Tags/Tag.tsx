export default function Tag({ children }) {
  return (
    <span className="border border-solid border-black-10 rounded-2xl px-3 py-1 inline-flex whitespace-nowrap">
      {children}
    </span>
  );
}
