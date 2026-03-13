import { useState } from "react";

export default function FolderItem({
  folder,
  selectedFolderId,
  onSelect,
  level = 0
}) {
  const [expanded, setExpanded] = useState(false);

  const hasChildren = folder.children && folder.children.length > 0;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div>
      <div
        style={{
          paddingLeft: 16 + level * 16,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          background: isSelected ? "#2c3e50" : "transparent",
          color: "white"
        }}
      >
        {hasChildren && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            style={{ marginRight: 6 }}
          >
            {expanded ? "▾" : "▸"}
          </span>
        )}

        <span onClick={() => onSelect(folder)}>
          {folder.name}
        </span>
      </div>

      {expanded &&
        hasChildren &&
        folder.children.map(child => (
          <FolderItem
            key={child.id}
            folder={child}
            selectedFolderId={selectedFolderId}
            onSelect={onSelect}
            level={level + 1}
          />
        ))}
    </div>
  );
}
