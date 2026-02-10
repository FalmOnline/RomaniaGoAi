import Tag from "./Tag";

export default function TagList({ tags = [], className = "" }) {
  return (
    <ul className={"flex gap-1" + className}>
      {tags.map((t) => (
        <li key={t}>
          <Tag>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}
