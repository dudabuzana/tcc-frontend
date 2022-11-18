/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Formulario from '../../componentes/img/4649FF.jpeg';
import Disciplina from '../../componentes/img/7978FF.jpeg';
import Turma from '../../componentes/img/C47AFF.jpeg';
import { MenuHeader } from '../../componentes/menu';

export function Home() {
  const cards = [{
    id: 1, 
    title: 'Formulários',
    description: 'Acesso os formulários já criados para as disciplinas e as respostas registradas pelos alunos',
    href: '/formulario/list'
  }, {
    id: 2, 
    title: 'Disciplinas',
    description: 'Acesse as disciplinas disponibilizadas para a instituição',
    href: '/disciplina/list'
  }, {
    id: 3, 
    title: 'Turmas',
    description: 'Acesso as turmas vinculadas ao seu usuário',
    href: '/turma/list'
  }];

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <MenuHeader/>
      <Container sx={{ py: 12 }}>
          <Grid container spacing={12} >
            {cards.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia component="img" image={card.id === 1 ? Formulario : card.id === 2 ? Disciplina : Turma} />
                  <CardContent sx={{ flexGrow: 1 }} >
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" href={card.href} sx={{mb: 1, ml: 1}}>Visualizar</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
      </Container>
      <Container disableGutters component="main" sx={{ py: 8 }}>
        {/* <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Pricing
        </Typography> */}
        <Typography align="center" color="text.secondary" component="p">
          Projeto desenvolvido como Trabalho de Conclusão do curso de Engenharia de Software, Universidade do Estado de Santa Catarina
        </Typography>
      </Container>
    </React.Fragment>
  );
}