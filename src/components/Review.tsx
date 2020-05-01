import React, { useContext } from 'react'
import { Box, Heading } from 'grommet'
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

  return (
    <Box pad="48px">
      <Heading margin="none" level={3}>
        {translateByID('submit')}
      </Heading>

      <Markdown>{translateByID('submit-instructions')}</Markdown>

      <Summary setPage={setPage} values={values} pages={pages} />
    </Box>
  )
}

export default Review
