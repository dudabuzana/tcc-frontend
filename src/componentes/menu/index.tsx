/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Magnolia from '../img/magnolia.ico';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';
import { deepPurple } from '@mui/material/colors';

export function MenuHeader() {
  const handleLogout = () => { 
    localStorage.removeItem("token");
    localStorage.removeItem("nivel");
    localStorage.removeItem("cpfCnpj");
    window.location.href = "/login"
  }

  const nivel = localStorage.getItem('nivel');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
          <Toolbar sx={{ flexWrap: 'wrap' }}>
            <Button href="#" variant="text" sx={{ my: 1, mx: 1.5, ml: 10 }}>
              <img src={Magnolia} width="50px" />
            </Button>
            <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }} /> {/*Deixar espaçamento*/}
            <nav>
                {(nivel === 'instituicao') && <Button variant="text" sx={{ my: 1, mx: 1.5 }} href="/professor/list">Professores</Button>}
                {(nivel === 'instituicao') && <Button variant="text" sx={{ my: 1, mx: 1.5 }} href="/aluno/list">Alunos</Button>}
                <Button variant="text" sx={{ my: 1, mx: 1.5 }} href="/disciplina/list">Disciplinas</Button>
                <Button variant="text" sx={{ my: 1, mx: 1.5 }} href="/turma/list">Turmas</Button>
                <Button variant="text" sx={{ my: 1, mx: 1.5 }}>Formulários</Button>
            </nav>
            <div>
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ my: 1, mx: 1.5, mr: 10 }}
                >
                    <Avatar sx={{ bgcolor: deepPurple[500] }} />
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem>
                        <ListItemIcon>
                            <Person fontSize="small" />
                        </ListItemIcon>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
                </div>
          </Toolbar>
      </AppBar>
  );
}