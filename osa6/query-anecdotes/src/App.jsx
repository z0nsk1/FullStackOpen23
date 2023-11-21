import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAll, updateAnecdote } from './services/requests'

const App = () => {

  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation({ // muutoksen hoitava mutaatio, vrt. lisäysmutaatio AnecdoteForm:ssa
    mutationFn: updateAnecdote, // kutsutaan nyt mutaten yhteydessä updateAnecdote-funktiota, jossa on axios:n put-pyyntö
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote', anecdote.id)
    const votedAnecdote = {...anecdote, votes: anecdote.votes + 1} // kasvatetaan ääniä yhdellä
    console.log(votedAnecdote)
    updateAnecdoteMutation.mutate(votedAnecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'], // kyselyn avain
    queryFn: getAll, // kyselyfunktiona on kaikki anekdootit hakeva funktio
    retry: 2 // jos yhteyttä serveriin ei saada, yritetään 2 kertaa uudestaan, ennen kuin result.isError toteutuu
  })

  console.log(JSON.parse(JSON.stringify(result)))
  console.log(result.data)

  if(result.isLoading) { // Tulostetaan datan latautumisen aikana muuta ja estetään koodin eteneminen ennen kuin data on ladannut (muutoin virhetilanne)
    return <div>loading data from the server...</div>
  }
  if (result.isError) { // Jos yhteys epäonnistui yritysten jälkeen, näytetään vain teksti, joka ilmoittaa virheestä
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
