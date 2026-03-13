export function buildFolderTree(folders) {
  const map = {};
  const roots = [];

  folders.forEach(folder => {
    map[folder.id] = { ...folder, children: [] };
  });

  folders.forEach(folder => {
    if (folder.parentId) {
      if (map[folder.parentId]) {
        map[folder.parentId].children.push(map[folder.id]);
      }
    } else {
      roots.push(map[folder.id]);
    }
  });

  return roots;
}
