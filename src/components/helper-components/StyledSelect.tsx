import React, { useState } from 'react'
import { Select as GrommetSelect, Box, SelectProps } from 'grommet'

export const StyledSelect: React.FC<SelectProps> = (props) => {
  const [open, setOpen] = useState(false)

  return (
    <Box style={{ maxWidth: '600px' }} className={open ? 'dropdown dropdown-open' : 'dropdown'}>
      <GrommetSelect onOpen={() => setOpen(true)} onClose={() => setOpen(false)} {...props} />
    </Box>
  )
}
