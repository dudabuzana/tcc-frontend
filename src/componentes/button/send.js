/* eslint-disable no-restricted-globals */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from '@mui/icons-material/Send';

export function SendButton({handleSend, formulario}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClickOpen} sx={{ mb: 0 }} disabled={formulario.status === 'enviado'}>
          <SendIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Envio de Formulário
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realizar o envio do formulário para os alunos da turma?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={async() => {handleSend(formulario); setOpen(false);}} autoFocus>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}