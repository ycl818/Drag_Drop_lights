import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
  DialogContent,
  TextField,
  Autocomplete,
} from "@mui/material";
import React, { useRef, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { useStore } from "reactflow";

const RenameDialog = ({
  setOpenRename,
  openRename,
  setNodes,
  setObjectEdit,
  objectEdit,
  nodes,
  setTriggerRenameDialog,
}) => {
  const nodesV = useStore((state) => state.getNodes());
  const [renameValue, setRenameValue] = useState("");

  const handleClose = () => {
    setOpenRename(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setObjectEdit({
      ...objectEdit,
      data: { ...objectEdit?.data, name: cellName },
    });
    console.log("jjjjjjjj", objectEdit);

    const newElement = nodesV.map((item) => {
      if (item.id === objectEdit?.id) {
        return {
          ...item,
          data: { ...item.data, name: cellName },
        };
      }
      return item;
    });

    setNodes(newElement);
    setTriggerRenameDialog(true);
  };

  const options = [
    "Select Cell",
    "AOI",
    "Assembly",
    "Dispenser",
    "Screw",
    "Test",
  ];
  const [cellName, setCellName] = useState(options[0]);

  const onChange = (e) => {
    setCellName(e.target.textContent);
  };

  return (
    <Dialog open={openRename} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Rename this node{" "}
        <CloseIcon
          onClick={handleClose}
          sx={{ "&:hover": { cursor: "pointer" } }}
        />
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* <TextField
            onChange={(e) => {
              setRenameValue(e.target.value);
            }}
            autoFocus
            margin="dense"
            id="name"
            label="Enter name here"
            type="text"
            fullWidth
            variant="standard"
          /> */}
          <Autocomplete
            disableClearable
            disablePortal
            value={cellName}
            onChange={onChange}
            options={options}
            sx={{ width: 300, height: 220, marginY: "0.5rem" }}
            renderInput={(params) => (
              <TextField {...params} label={`Cell Name`} />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: "#D73274",
              color: "white",
              "&:hover": { backgroundColor: "#ea77a3" },
            }}
            type="submit"
            variant="contained"
            onClick={handleClose}
          >
            Rename
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default React.memo(RenameDialog);
