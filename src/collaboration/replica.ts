import type { Element, Operation, Document } from "./types.js";

class Replica {
  private elements: Array<Element> = [];

  constructor(document: Document) {
    for (let i = 0; i < document.elements.length; i++) {
      this.elements.push({
        id: document.elements[i]!.id,
        value: document.elements[i]!.value,
        deleted: document.elements[i]!.deleted,
      });
    }
  }

  localOperation(operation: Operation) {
    if (operation.type === "insert") {
      const index = this.elements.findIndex((e) => e.id === operation.afterId);

      if (index === -1 && operation.afterId !== null) {
        return;
      }

      this.elements.splice(index + 1, 0, operation.element);
    } else if (operation.type === "delete") {
      const index = this.elements.findIndex(
        (e) => e.id === operation.elementId,
      );

      if (index === -1) {
        return;
      }

      this.elements[index]!.deleted = true;
    }
  }

  getElements() {
    return this.elements;
  }
}
