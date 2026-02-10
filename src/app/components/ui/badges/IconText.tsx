export default function IconText({ Icon, children, className = "" }) {
  return (
    <p className={"flex flex-row gap-1 items-center " + className}>
      <Icon size={18} strokeWidth={1.2} />
      {children}
    </p>
  );
}
