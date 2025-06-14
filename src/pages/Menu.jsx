import { Button, ButtonGroup } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Menu({user, logout}) {
  return (
    <div className='menu'>
      <ButtonGroup variant="contained" aria-label="Basic button group">
      </ButtonGroup>
      {user ?
        <>
            {user.email}
          <Button variant='contained' onClick={logout} className='asd'> Logout </Button>
      </>
      : <Link to="/login"><Button variant="contained" className='asd'>Login</Button></Link>
    }
    </div>
  )
}
