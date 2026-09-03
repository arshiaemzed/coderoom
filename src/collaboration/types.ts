type Document = {
  elements: Array<Element>;
};

type Element = {
  id: string;
  value: string;
  deleted: boolean;
};

type Operation = InsertOperation | DeleteOperation;

type InsertOperation = {
  type: "insert";
  afterId: string | null;
  element: Element;
};

type DeleteOperation = {
  type: "delete";
  elementId: string;
};

export type { Document, Element, Operation, InsertOperation, DeleteOperation };
