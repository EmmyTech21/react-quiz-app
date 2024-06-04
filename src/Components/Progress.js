import React from 'react'

export default function Progress({index, numQustions, points, maxPossiblePoints, answer}) {
  return (
    <header className='progress'>
      <progress max={numQustions} value={index +Number(answer !== null)} />
        <p>Question <strong>{index +1}</strong>/ {numQustions}</p>

        <p><strong>{points}</strong> / {maxPossiblePoints}</p>
    </header>
  )
}
