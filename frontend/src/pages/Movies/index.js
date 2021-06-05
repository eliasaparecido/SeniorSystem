import React, { useState } from "react";
import { Button, 
    Form, 
    Input,
    Navbar,
    NavbarBrand,
    InputGroup, 
    InputGroupAddon,
    Spinner,
    Card, 
    CardTitle, 
    CardText, 
    Col,
    Row,
    Container
    } from 'reactstrap'; 
import api from "../../services/api"

const Home = () => {

    const [search, setSearch] = useState('');
    const [valueInput, setValueInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [nomovies, setNoMovies] = useState(false)
    const [totalmovies, setTotalMovies] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        setNoMovies(false)

        try {
            if(search === "") alert('Essa requisição irá demorar alguns minutos.')
            let response = await api.get(`search?movie=${search}`)
                setMovies(response.data[0].moviesByYear)
                setTotalMovies(response.data[1].total)
                if(response.data[1].total === 0)
                {
                    setNoMovies(true)
                }
            setLoading(false)
        } catch (error) {
            alert('Desculpe não conseguimos completar sua requisição')
            setLoading(false)
            setMovies([])
            setTotalMovies('')
            setSearch('')
        }
    }

    const setClear = async (event) => {
        setMovies([])
        setTotalMovies('')
        setSearch('')
        setValueInput('')
    }

    return (
    <>  
        <Container>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">Lançamento de Filmes por Ano</NavbarBrand>
            </Navbar>
        </Container>
        <Container>
            <Col sm="8">
                <Form sm="12" >
                    <InputGroup>
                        <Input 
                            id="search" 
                            name="seach" 
                            placeholder="Digite um filme para pesquisar" 
                            onChange={(e) => (setSearch(e.target.value), setValueInput(e.target.value))}
                            value={valueInput}
                            />
                        <InputGroupAddon addonType="append">
                            <Button color="secondary" onClick={handleSubmit}>Pesquisar</Button>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="append">
                            <Button color="secondary" onClick={setClear}>Limpar</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Form>
            </Col>
        </Container>
        <Container>
            {loading ? 
                <Spinner color="primary" style={{margin: '50px'}}/> :
                    movies.length > 0 &&
                    <>
                        <Row style={{margin: '5px'}}>
                            <Col sm="12">Filme: {search !== ""? search : "Todos os lançamentos"}</Col>
                            <Col sm="12">Total: {totalmovies} filmes encontrados</Col>
                        </Row>
                        <Row style={{margin: '5px'}}>
                            {
                                movies.map((movie, index) =>
                                   
                                        <Col sm="3" key={index}>
                                            <Card body  style={{marginTop: '10px'}}>
                                                <CardTitle tag="h5"  >Ano: {movie.year}</CardTitle>
                                                <CardText>Total: {movie.movies}</CardText>
                                            </Card>
                                        </Col>
                                    
                                )
                            }
                        </Row>  
                    </> 
            }  
        </Container>
        <Container>
            {
                
                nomovies && <p>Nenhum filme encontrado.</p>
                
            }
        </Container>
    </>
    );
}

export default Home
