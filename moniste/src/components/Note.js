const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'
  console.log('Päivitettävä muistiinpano: ', note.id)

    return ( // HTML:ssä käytetään class-attribuuttia, reactissa vastaava on className
    // Attribuuttia voidaan hyödyntää tyylien asettamisessa
      <li className="note"> 
        {note.content}
        <button onClick={toggleImportance}>{label}</button>
      </li>
    )
  }

  export default Note