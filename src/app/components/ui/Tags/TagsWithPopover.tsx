import TagsPopover from "./TagsPopover";
import TagList from "./TagList";

export default function TagsWithPopover({ tags = [] }) {
  const visible = tags.slice(0, 2);
  const remaining = tags.slice(2);

  return (
    <div className="flex flex-row gap-2 items-center text-rg-black-70 text-sm">
      <TagList tags={visible} />
      {remaining.length > 0 && (
        <TagsPopover remaining={remaining} total={tags.length} />
      )}
    </div>
  );
}
