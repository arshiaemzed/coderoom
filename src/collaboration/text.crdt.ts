import type { Element, Operation, Document } from "./types.js";

class TextCRDT {
  private elements: Array<Element> = [];

  constructor(text: string) {
    for (let i = 0; i < text.length; i++) {
      this.elements.push({
        id: crypto.randomUUID(),
        value: text[i]!,
        deleted: false,
      });
    }
  }

  operation(operation: Operation) {}

  getDocument(): Document {
    return { elements: this.elements };
  }

  getText() {
    let text = "";

    for (let i = 0; i < this.elements.length; i++) {
      text += this.elements[i]?.value;
    }

    return text;
  }
}

export default TextCRDT;
