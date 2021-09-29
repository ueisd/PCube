export  class DataTreeFetcher {
    static setRecursivelyChildrensFromList<T>(
        item: T,
        tree: {
            itemList: T[],
            fieldsNames: {
                childs: string,
                id: string,
                parentId: string
            },
        } ,
        idToExcude?:number
    ) {
        let fNames = tree.fieldsNames;
        let itemList = tree.itemList;
        item[fNames.childs] = itemList.filter(child => {
            if(idToExcude && idToExcude === child[fNames.id])
                return false;
            return child[fNames.parentId] === item[fNames.id];
        });
        for(let child of item[fNames.childs]) {
            if(idToExcude)
                this.setRecursivelyChildrensFromList(child, tree, idToExcude);
            else
                this.setRecursivelyChildrensFromList(child, tree);
        }
    }

    static fetchProjectTree<T>(
        tree: {
            itemList: T[],
            fieldsNames: {
                childs: string,
                id: string,
                parentId: string
            },
        } ,  idToExcude?:number
    ): T[] {
        let items = tree.itemList;
        let fNames = tree.fieldsNames;
        let rootItems = items.filter(rootItem => {
            if(idToExcude && idToExcude === rootItem[fNames.id]) 
                return false;
            else
                return rootItem[fNames.parentId] === null;
        });
        for(let rootItem of rootItems) {
            if(idToExcude)
                DataTreeFetcher.setRecursivelyChildrensFromList(
                    rootItem, tree, idToExcude
                );
            else
                DataTreeFetcher.setRecursivelyChildrensFromList(rootItem, tree);
        }
        return rootItems;
    }
}