import Tag from "./Tag";

interface TagListProps {
  tags?: string[];
  className?: string;
}

export default function TagList({ tags = [], className = "" }: TagListProps) {
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
