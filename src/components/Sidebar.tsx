import React, { useContext } from 'react'
import { Card } from './helper-components'
import { Box, Text, Select, Image, ResponsiveContext } from 'grommet'
import { LanguageContext } from '../contexts/language'
import { FormContext } from '../contexts/form'
import { range } from 'lodash'
import { Markdown } from './helper-components/Markdown'

interface Props {
  pages: string[]
}

const languages = [
  { title: 'English', value: 'en' },
  { title: '中文', value: 'zh' },
  { title: 'Español', value: 'es' },
]

const Sidebar: React.FC<Props> = (props) => {
  const { pages } = props
  const { translateByID, form, pageIndex, setPage, completion } = useContext(FormContext)
  const { language, setLanguage } = useContext(LanguageContext)
  const size = useContext(ResponsiveContext)

  const currentPage = pages[pageIndex]
  const percent = Math.floor((pageIndex / (pages.length - 1)) * 100)

  const canClickPage = (i: number) => {
    return range(0, i).every((index) => completion[index])
  }

  return (
    <Box
      flex={{ shrink: 0 }}
      margin={size === 'small' ? { top: 'small' } : { left: 'small' }}
      direction="column"
      width={size === 'small' ? '100%' : '350px'}
    >
      <Card
        margin={{ bottom: 'small' }}
        pad={{ horizontal: size === 'small' ? '24px' : 'medium', vertical: 'small' }}
        background="white"
      >
        <Markdown>{translateByID('demo-warning')}</Markdown>
      </Card>
      <Card background="white" pad="medium">
        {form.seal && (
          <Box margin={{ bottom: 'medium' }}>
            <Image src={form.seal} style={{ maxHeight: '175px', maxWidth: '100%', objectFit: 'contain' }} />
          </Box>
        )}
        <Box>
          <Text weight={600}>{translateByID('language')}</Text>
          <Select
            a11yTitle="select language"
            margin={{ top: 'xsmall' }}
            options={languages}
            labelKey="title"
            valueKey={{ key: 'value', reduce: true }}
            value={language}
            onChange={({ value }) => setLanguage(value)}
          />
        </Box>
        <Box margin={{ top: 'medium' }}>
          <Text weight={600}>{translateByID('progress')}</Text>
          <Box
            margin={{ top: 'xsmall' }}
            style={{ width: '100%', height: '8px', borderRadius: '12px', background: '#E4E7EB' }}
          >
            <Box style={{ width: `${percent}%`, height: '100%', borderRadius: '12px', background: '#3E73FF' }} />
          </Box>
          <Box align="center">
            {' '}
            <Text weight={300} size="xsmall">
              {percent}% {translateByID('complete')}
            </Text>{' '}
          </Box>
        </Box>
        <Box margin={{ top: 'small' }}>
          {size === 'small' ? (
            <>
              {/* On small screens, we collapse the section titles to a Select */}
              <Text weight={600}>{translateByID('section')}</Text>
              <Select
                a11yTitle="select section"
                margin={{ top: 'xsmall' }}
                options={pages.map((page, i) => ({ page, i, disabled: !canClickPage(i) }))}
                labelKey="page"
                valueKey={{ key: 'i', reduce: true }}
                disabledKey="disabled"
                value={pageIndex as any} /* These type definitions don't support values as numbers */
                // TODO: In production, add a `canClickPage(i) && ` below to prevent folks from jumping forward.
                onChange={({ value: i }) => setPage(i)}
              />
            </>
          ) : (
            /* On larger screens, we show all section titles as a list */
            pages.map((page, i) => {
              return (
                <Text
                  style={{
                    cursor: canClickPage(i) ? 'pointer' : 'not-allowed',
                    opacity: currentPage === page ? '100%' : canClickPage(i) ? '50%' : '20%',
                  }}
                  // TODO: In production, add a `canClickPage(i) && ` below to prevent folks from jumping forward.
                  onClick={() => setPage(i)}
                  margin={{ bottom: 'xsmall' }}
                  key={page}
                >
                  {page}
                </Text>
              )
            })
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default Sidebar
