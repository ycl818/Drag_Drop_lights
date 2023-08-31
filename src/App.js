import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RenameDialog from "./RenameDialog/RenameDialog";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Controls,
  Background,
  MiniMap,
  Panel,
  useStore,
  useStoreApi,
  useReactFlow,
  updateEdge,
} from "reactflow";

import CustomNode from "./CustomNode";
import FloatingEdge from "./FloatingEdge";
import CustomConnectionLine from "./CustomConnectionLine";
import { ReactFlowProvider } from "reactflow";

import "reactflow/dist/style.css";
import "./style.css";

import Light from "./Light/Light";
import Sibebar from "./Sibebar";
import "./Sidebar.css";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import AutoCompleteName from "./AutoCompleteName/AutoCompleteName";
import DrawerForPics from "./Drawer/DrawerForPics";
import AddIcon from "@mui/icons-material/Add";
import IOSSwitch from "./Switcher/IOSSwitch";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import RestoreIcon from "@mui/icons-material/Restore";

// const connectionLineStyle = { stroke: "#000" };
// const snapGrid = [20, 20];
// const nodeTypes = {
//   imageNode: ImageNode,
// };

// const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const initialNodes = [];
// const initialNodes = [
//   {
//     id: "1",
//     type: "custom",
//     data: {
//       image: {
//         url: "https://source.unsplash.com/300x400?summer",
//         alt: "my first image",
//       },
//     },
//     position: { x: 0, y: 100 },
//   },
//   {
//     id: "2",
//     type: "custom",
//     data: {
//       image: {
//         url: "https://source.unsplash.com/400x300?spring",
//         alt: "my second image",
//       },
//     },
//     position: { x: 0, y: 300 },
//   },
//   {
//     id: "3",
//     type: "custom",
//     data: {
//       image: {
//         url: "https://source.unsplash.com/400x300?autumn",
//         alt: "my second image",
//       },
//     },
//     position: { x: 300, y: 300 },
//   },
//   {
//     id: "4",
//     type: "custom",
//     data: {
//       image: {
//         url: "https://source.unsplash.com/400x300?winter",
//         alt: "my second image",
//       },
//     },
//     position: { x: 300, y: 0 },
//   },
// ];

const initialEdges = [];

const connectionLineStyle = {
  strokeWidth: 1,
  stroke: "black",
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  animated: true,

  style: { strokeWidth: 4, stroke: "black" },
  type: "floating",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "black",
  },
};

const flowKey = "example-flow";
const CustomNodeFlow = () => {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const [stateForAutoComplete, setStateForAutoComplete] = useState(false);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        console.log(flow);
        const { x, y, zoom } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
        setStateForAutoComplete(true);
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // const addNode = () => {
  //   const newNode = {
  //     id: `${Date.now()}`,
  //     data: {
  //       image: {
  //         url: `https://source.unsplash.com/400x300?flower`,
  //         alt: "my second image",
  //         overlayContent: <Light />,
  //       },
  //     },
  //     type: "custom",
  //     position: {
  //       x: 0,
  //       y: 0,
  //     },
  //   };

  //   newNode.data = { ...newNode.data, id: `${newNode.id}` };
  //   setNodes((prev) => {
  //     return [...prev, newNode];
  //   });

  //   console.log(nodes);
  // };

  // const addNode2 = () => {
  //   const newNode = {
  //     id: `${Date.now()}`,
  //     data: {
  //       name: "",
  //       image: {
  //         url: `https://source.unsplash.com/400x300?sea`,
  //         alt: "my second image",
  //       },
  //     },
  //     type: "custom",
  //     position: {
  //       x: 0,
  //       y: 0,
  //     },
  //   };

  //   newNode.data = { ...newNode.data, id: `${newNode.id}` };
  //   setNodes((prev) => {
  //     return [...prev, newNode];
  //   });

  //   console.log(nodes);
  // };

  const nodesV = useStore((state) => state.getNodes());

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: `${Date.now()}`,
        data: {
          name: `node${nodesV.length + 1}`,
          color: "grey",
          image: {
            // url: `https://source.unsplash.com/400x300?${type}`,
            url: `${type}`,
            alt: `${type}`,
          },
          // onChange: (evt) => {
          //   console.log(evt.target);
          //   setNodes((eds) => {
          //     return eds.map((node) => {
          //       if (node.id == this.id) {
          //         node.data = {
          //           ...node.data,
          //           name: evt.target.value,
          //         };
          //       }
          //     });
          //   });
          // },
        },
        type: "custom",
        position,
      };
      newNode.data = { ...newNode.data, id: `${newNode.id}` };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, nodesV]
  );
  const palette = useMemo(() => {
    return ["red", "yellow", "green"];
  }, []);
  const palette2 = useMemo(() => {
    return ["yellow", "green", "red"];
  }, []);
  const palette3 = useMemo(() => {
    return ["green", "red", "yellow"];
  }, []);

  useEffect(() => {
    let index = Math.floor(Math.random() * palette.length);
    const newElement = nodesV?.map((item) => {
      if (item?.data.name === "AOI") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette[index],
          },
        };
      } else if (item?.data.name === "Assembly") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette2[index],
          },
        };
      } else if (item?.data.name === "Dispenser") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette3[index],
          },
        };
      } else if (item?.data.name === "Screw") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette2[index],
          },
        };
      } else if (item?.data.name === "Test") {
        return {
          ...item,
          data: {
            ...item.data,
            color: palette[index],
          },
        };
      }
      return item;
    });

    let timer;
    if (newElement && nodesV.length !== 0) {
      timer = setInterval(() => {
        setNodes(newElement);
      }, 3000);
    }

    return () => clearInterval(timer);
  }, [nodesV]);

  const [objectEdit, setObjectEdit] = useState({});

  const [openRename, setOpenRename] = useState(false);

  const onElementClick = useCallback((event, object) => {
    console.log("file: App.js:227 ~ onElementClick ~ event:", event);

    setObjectEdit(object);
  }, []);

  const onElementDoubleClick = useCallback((event, object) => {
    setOpenRename(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setObjectEdit({});
  }, []);

  const [openDrawer, setOpenDrawer] = useState(false);

  // switcher
  const [checked, setChecked] = React.useState(true);

  const handleChange = useCallback((event) => {
    setChecked(event.target.checked);
  }, []);

  const greenLightNum = useMemo(() => {
    let cnt = 0;
    nodes?.map((node) => {
      if (node.data.color === "green") {
        cnt++;
      }
      return cnt;
    });

    return cnt;
  }, [nodes]);

  const yellowLightNum = useMemo(() => {
    let cnt = 0;
    nodes?.map((node) => {
      if (node.data.color === "yellow") {
        cnt++;
      }
      return cnt;
    });

    return cnt;
  }, [nodes]);

  const redLightNum = useMemo(() => {
    let cnt = 0;
    nodes?.map((node) => {
      if (node.data.color === "red") {
        cnt++;
      }
      return cnt;
    });

    return cnt;
  }, [nodes]);

  const greyLightNum = useMemo(() => {
    let cnt = 0;
    nodes?.map((node) => {
      if (node.data.color === "grey") {
        cnt++;
      }
      return cnt;
    });

    return cnt;
  }, [nodes]);

  const edgeUpdateSuccessful = useRef(true);
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const [triggerRenameDialog, setTriggerRenameDialog] = useState(false);

  return (
    <>
      <div className="dndflow">
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            // fitView
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            snapToGrid={true}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineComponent={CustomConnectionLine}
            connectionLineStyle={connectionLineStyle}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onElementClick}
            onNodeDoubleClick={onElementDoubleClick}
            onPaneClick={onPaneClick}
            minZoom={0.1}
          >
            <Background />
            <Controls style={{ zIndex: 9999 }} />
            <MiniMap />
            <Panel
              position="top-right"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Tooltip title="Add Cell">
                <IconButton onClick={() => setOpenDrawer(true)}>
                  <AddIcon sx={{ fontSize: "3rem" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save">
                <IconButton onClick={onSave}>
                  <SaveAltIcon sx={{ fontSize: "2rem" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Restore">
                <IconButton onClick={onRestore}>
                  <RestoreIcon sx={{ fontSize: "2rem" }} />
                </IconButton>
              </Tooltip>
            </Panel>
            <Panel>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Switch
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <p
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "350px",
                  }}
                >
                  <span style={{ color: "#2dc937" }}>
                    Green:{greenLightNum}
                  </span>
                  <span style={{ color: "#e7b416" }}>
                    Yellow:
                    {yellowLightNum}
                  </span>
                  <span style={{ color: "#cc3232" }}>Red: {redLightNum}</span>
                  <span style={{ color: "grey" }}>Grey: {greyLightNum}</span>
                  <span>Total: {nodes.length}</span>
                </p>
              </Box>

              {/* <FormControlLabel
                control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                label="Detail"
                checked={checked}
                onChange={handleChange}
              /> */}

              <Box
                sx={{
                  height: "80vh",
                  overflow: "auto",
                  width: "240px",
                  overflowX: "hidden",
                  display: checked ? "block" : "none",
                }}
              >
                {nodes.map((node) => {
                  return (
                    <Box
                      display="flex"
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                      key={node["data"].id}
                    >
                      <AutoCompleteName
                        nodeData={node}
                        objectEdit={objectEdit}
                        setObjectEdit={setObjectEdit}
                        setNodes={setNodes}
                        nodesV={nodesV}
                        setStateForAutoComplete={setStateForAutoComplete}
                        stateForAutoComplete={stateForAutoComplete}
                        setTriggerRenameDialog={setTriggerRenameDialog}
                        triggerRenameDialog={triggerRenameDialog}
                      />
                      <Light nodeData={node} />
                    </Box>
                  );
                })}
              </Box>

              <DrawerForPics
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
                setObjectEdit={setObjectEdit}
                setOpenRename={setOpenRename}
              />

              {/* <button>Click me1</button> */}
              {/* <button onClick={addNode2}>Click me2</button> */}
              {objectEdit.type === "custom" && (
                <>
                  <RenameDialog
                    openRename={openRename}
                    setOpenRename={setOpenRename}
                    objectEdit={objectEdit}
                    setObjectEdit={setObjectEdit}
                    setNodes={setNodes}
                    nodes={nodes}
                    setTriggerRenameDialog={setTriggerRenameDialog}
                  />

                  {/* <input
                    value={objectEdit.data.name}
                    onChange={(e) => {
                      setObjectEdit({
                        ...objectEdit,
                        data: { ...objectEdit.data, name: e.target.value },
                      });

                      const newElement = nodes.map((item) => {
                        if (item.id === objectEdit.id) {
                          return {
                            ...item,
                            data: { ...item.data, name: e.target.value },
                          };
                        }
                        return item;
                      });

                      setNodes(newElement);
                    }}
                  /> */}
                </>
              )}
            </Panel>
          </ReactFlow>
        </div>
        {/* <Sibebar
          onElementClick={onElementClick}
          setObjectEdit={setObjectEdit}
          setOpenRename={setOpenRename}
        /> */}
      </div>
    </>
  );
};

function DnDFlowProvider(props) {
  return (
    <ReactFlowProvider>
      <CustomNodeFlow {...props} />
    </ReactFlowProvider>
  );
}

// export default CustomNodeFlow;
export default React.memo(DnDFlowProvider);
