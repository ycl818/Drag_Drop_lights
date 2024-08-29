import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
  DialogContent,
  TextField,
  Autocomplete,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleCopyId = async () => {
    if (objectEdit?.id) {
      try {
        await navigator.clipboard.writeText(objectEdit.id);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  return (
    <Dialog open={openRename} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }}
      >
        Rename and View Node Details
        <CloseIcon
          onClick={handleClose}
          sx={{ "&:hover": { cursor: "pointer" } }}
        />
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Node Details
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <DialogContentText sx={{ display: "flex", alignItems: "center" }}>
                <strong>Node ID:</strong> {objectEdit?.id}
                <Tooltip title={copySuccess ? "Copied!" : "Copy ID"}>
                  <IconButton
                    onClick={handleCopyId}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </DialogContentText>
              <DialogContentText>
                <strong>Current Name:</strong> {objectEdit?.data?.name}
              </DialogContentText>
              <DialogContentText>
                <strong>Type:</strong> {objectEdit?.type}
              </DialogContentText>
              <DialogContentText>
                <strong>Position:</strong> X: {objectEdit?.position?.x}, Y:{" "}
                {objectEdit?.position?.y}
              </DialogContentText>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rename Node
            </Typography>
            <Autocomplete
              disableClearable
              disablePortal
              value={cellName}
              onChange={onChange}
              options={options}
              sx={{ width: "100%", mt: 1 }}
              renderInput={(params) => (
                <TextField {...params} label="Cell Name" fullWidth />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #e0e0e0", p: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            sx={{
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
