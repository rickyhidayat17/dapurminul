interface Props {
  categories: string[];
  onSelect: (value: string) => void;
}

export default function CategoryList({
  categories,
  onSelect,
}: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3">
      {categories.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-medium"
        >
          {item}
        </button>
      ))}
    </div>
  );
}