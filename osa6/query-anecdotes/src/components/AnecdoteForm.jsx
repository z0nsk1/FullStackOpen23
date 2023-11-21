import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNew } from "../services/requests"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createNew, // kutsutaan mutaten yhteydessä createNew funktiota, joka laittaa datan palvelimelle (axios)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] }) // Mitätöindään (invaloidaan) kyselyn vanha tulos, jonka avain on 'anecdotes', jotta uusi muistiinpano renderöityy
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content: content, votes: 0 }) // suoritetaan mutaatio kutsumalla metodia mutate uuden anekdootin luomisen yhteydessä, huom. koska mutaation mutationFn on määritelty createNew, suoritetaan mutaten yhteydessä myös uuden datan vienti palvelimelle
    console.log(`new anecdote "${content}" created`)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
