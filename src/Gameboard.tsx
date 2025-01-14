import './Gameboard.css'
import {Field} from './types.ts'

export default function Gameboard(props: any) {
    const {chosenSymbol, gameFields, updateGameFields, setPlayerTurns} = props

    const fields = gameFields.map((f:Field) => {
        return <button onClick={() => handleClick(f)} className="field">{f.value}</button>
    })

    function handleClick(field:Field) {
        updateGameFields(field, chosenSymbol)
        setPlayerTurns((prevTurns: number) => prevTurns + 1)
    }

    return (
        <div className="gameboard">
            {fields}
        </div>
    )
}