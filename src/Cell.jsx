import React from 'react'
import { clsx } from 'clsx'

const Cell = ({ value, row, col, selected }) => {
  const classes = clsx(['cell', { selected }])
  return (
    <div className={classes} data-row={row} data-col={col} data-selected={selected}>
      {value}
    </div>
  )
}

export default Cell
