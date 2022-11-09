/* eslint-disable array-callback-return */
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { DeleteButton } from '../../componentes/button/delete';
import { TurmaProps, AlunosTurmaProps } from "../../types/turma";
import { api } from "../../services/api";

function createData(
  disciplina: string,
  professor: string,
  semestre: string,
  actions: string,
) {
  return {
    disciplina,
    professor,
    semestre,
    actions,
  };
}

function Row(props: { row: ReturnType<typeof createData>, alunos: AlunosTurmaProps[] }) {
  const { row, alunos } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {alunos.length > 0 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell component="th" scope="row">{row.disciplina}</TableCell>
        <TableCell>{row.professor}</TableCell>
        <TableCell>{row.semestre}</TableCell>
        <TableCell align="right">
            <div>
                <Button href="/login">
                    <EditIcon />
                </Button>
                <Button>
                  <DeleteButton handleDelete={() => {}} id={''} title={'Turma'}/>
                </Button>
            </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Alunos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>CPF</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Matrícula</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alunos.map((aluno) => (
                    <TableRow key={aluno.cpfCnpj}>
                      <TableCell component="th" scope="row">
                        {aluno.cpfCnpj}
                      </TableCell>
                      <TableCell>{aluno.Pessoa.nome}</TableCell>
                      <TableCell>{aluno.Pessoa.matricula}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function TurmaAlunosTable() {
    const [turmas, setTurmas] = React.useState<TurmaProps[]>([]);
    const [alunos, setAlunos] = React.useState<AlunosTurmaProps[]>([]);

    const fetchTurmas = async () => {
        const url = localStorage.getItem('nivel') === 'instituicao' ? "turma" : `professor/${localStorage.getItem('cpfCnpj')}/turma`;
        const response = await api.get<TurmaProps[]>(url);
        if (response.status === 200) {
          setTurmas(response.data)
        }     
    };

    const fetchAlunos = async (turma: string) => {
      const response = await api.get<AlunosTurmaProps[]>(`turma/${turma}/aluno`);
      if (response.status === 200) {
        setAlunos(response.data)
      }  
    }

    React.useEffect(() => {
        if (turmas.length === 0) {
          fetchTurmas();
        } else if (alunos.length === 0) {
          turmas.map((turma) => {
            fetchAlunos(turma.id);
          })
        }
    });
        
    return (
        <TableContainer>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell />
                <TableCell style={{ fontWeight: "bold" }}>Disciplina</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Professor</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Semestre</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="right" />
            </TableRow>
            </TableHead>
            <TableBody>
            {turmas.map((turma) => {
                const row = createData(turma.Disciplina.nome, turma.Pessoa.nome, turma.semestre, "");
                var alunosTurma: AlunosTurmaProps[] = [];
                alunos.map((aluno) => {
                  if (aluno.id === turma.id) {
                    alunosTurma = [...alunosTurma, aluno];
                  }
                })
                return (<Row key={turma.id} row={row} alunos={alunosTurma} />)
            })}
            </TableBody>
        </Table>
        </TableContainer>
    );
}
