export class DataTreeFetcher {
  static setRecursivelyChildrensFromList<T>(
    item: T,
    tree: {
      itemList: T[];
      fieldsNames: {
        childs: string;
        id: string;
        parentId: string;
      };
    },
    idToExcude?: number
  ) {
    const fNames = tree.fieldsNames;
    const itemList = tree.itemList;
    item[fNames.childs] = itemList.filter((child) => {
      if (idToExcude && idToExcude === child[fNames.id]) {
        return false;
      }
      return child[fNames.parentId] === item[fNames.id];
    });
    for (const child of item[fNames.childs]) {
      if (idToExcude) {
        this.setRecursivelyChildrensFromList(child, tree, idToExcude);
      } else {
        this.setRecursivelyChildrensFromList(child, tree);
      }
    }
  }

  static fetchProjectTree<T>(
    tree: {
      itemList: T[];
      fieldsNames: {
        childs: string;
        id: string;
        parentId: string;
      };
    },
    idToExcude?: number
  ): T[] {
    const items = tree.itemList;
    const fNames = tree.fieldsNames;
    const rootItems = items.filter((rootItem) => {
      if (idToExcude && idToExcude === rootItem[fNames.id]) {
        return false;
      } else {
        return rootItem[fNames.parentId] === null;
      }
    });
    for (const rootItem of rootItems) {
      if (idToExcude) {
        DataTreeFetcher.setRecursivelyChildrensFromList(rootItem, tree, idToExcude);
      } else {
        DataTreeFetcher.setRecursivelyChildrensFromList(rootItem, tree);
      }
    }
    return rootItems;
  }
}
