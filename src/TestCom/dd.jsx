import React, { useState } from "react";
import ReactFlow, {
  removeElements,
  addEdge,
  Handle,
} from "react-flow-renderer";

const InputNode = ({ type, data }) => {
  return (
    <>
      <Handle type="target" position="left" />
      type: {type}
      <br />
      value:{data.value}
      <Handle type="source" position="right" id="a" />
    </>
  );
};

const nodeTypes = {
  InputNode: InputNode,
  TextAreaNode: TextAreaNode,
  BooleanNode: BooleanNode,
  Input2Node: Input2Node,
};

const initialElements = [];

const initialInput = {
  type: "InputNode",
  data: { value: "" },
  style: { border: "1px solid #777", padding: 10, width: 150 },
  position: { x: 250, y: 25 },
};

export default () => {
  const [elements, setElements] = useState(initialElements);

  const [objectEdit, setObjectEdit] = useState({});

  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) =>
    setElements((els) => {
      return addEdge({ ...params, arrowHeadType: "arrowclosed" }, els);
    });

  const onElementClick = (event, object) => {
    setObjectEdit(object);
  };

  const onPaneClick = () => {
    setObjectEdit({});
  };

  const onSubmit = () => {
    alert(JSON.stringify(elements));
  };

  return (
    <div>
      <div>
        <div style={{ textAlign: "left", padding: 10 }}>
          <button
            onClick={() => {
              onSubmit();
            }}
          >
            Deploy
          </button>
          <hr />
          <button
            onClick={() => {
              const id = `${elements.length + 1}`;

              setElements([...elements, { ...initialInput, id }]);
            }}
          >
            Add Input
          </button>{" "}
          <button
            onClick={() => {
              const id = `${elements.length + 1}`;

              setElements([...elements, { ...initialTextArea, id }]);
            }}
          >
            Add Text Area
          </button>{" "}
          <button
            onClick={() => {
              const id = `${elements.length + 1}`;

              setElements([...elements, { ...initialBoolean, id }]);
            }}
          >
            Add Boolean
          </button>{" "}
          <button
            onClick={() => {
              const id = `${elements.length + 1}`;

              setElements([...elements, { ...initialInput2, id }]);
            }}
          >
            Add 2 Input
          </button>
        </div>
      </div>

      <div style={{ textAlign: "left", padding: 10 }}>
        {objectEdit.type === "InputNode" && (
          <input
            value={objectEdit.data.value}
            onChange={(e) => {
              setObjectEdit({
                ...objectEdit,
                data: { ...objectEdit.data, value: e.target.value },
              });

              const newElement = elements.map((item) => {
                if (item.id === objectEdit.id) {
                  return {
                    ...item,
                    data: { ...item.data, value: e.target.value },
                  };
                }
                return item;
              });

              setElements(newElement);
            }}
          />
        )}
      </div>
      <hr />
      <div style={{ height: 500 }}>
        <ReactFlow
          elements={elements}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          deleteKeyCode={46} /* 'delete'-key */
          onElementClick={onElementClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
        />
      </div>
    </div>
  );
};
