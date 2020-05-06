import React, { useContext } from 'react'
import { Box, Heading, ResponsiveContext } from 'grommet'
import { FormContext } from '../contexts/form'
import Summary from './Summary'
import { Markdown } from './helper-components/Markdown'
import { Page } from '../lib/types'

interface Props {
  pages: Page[]
}

const Review: React.FC<Props> = (props) => {
  const { pages } = props
  const { values, translateByID, setPage } = useContext(FormContext)
  const size = useContext(ResponsiveContext)

  const padding = size === 'small' ? '12px' : '24px'
  return (
    <Box pad={{ horizontal: padding, top: padding, bottom: 'none' }} direction="column" justify="start">
      <Heading color="black" margin="none" level={3}>
        {translateByID('submit')}
      </Heading>

      <Markdown size="small">{translateByID('submit-instructions')}</Markdown>

      <Summary setPage={setPage} values={values} pages={pages} />
    </Box>
  )
}

export default Review
