/* eslint-disable no-restricted-globals */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';

export function DeleteButton({handleDelete, id, title}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClickOpen} sx={{ mb: 0 }}>
          <DeleteIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Exclusão de {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente realizar a exclusão do registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={async() => {handleDelete(id); setOpen(false);}} autoFocus>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}