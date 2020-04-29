import React, { useContext } from 'react'
import { Question, FileValues } from '../../lib/types'
import { FormContext } from '../../contexts/form'
import { FormNextLink, Checkmark, FormClose } from 'grommet-icons'
import { useDropzone, DropEvent } from 'react-dropzone'
import { Box, Button, Paragraph, Image } from 'grommet'
import { encode } from 'base64-arraybuffer'
import './file.css'
import { CircleIcon } from '../helper-components/CircleIcon'

interface Props {
  [key: string]: any
  question: Question
  onChange: (val: string) => void
}

/**
 * This File component is used to upload a single image or PDF file.
 * It supports drag-and-drop, file upload and image capture.
 *
 * It's built on top of:
 *  - React Dropzone: https://react-dropzone.js.org/
 *  - FileReader API: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *
 * The contents of the uploaded file are stored as a base64-encoded binary string
 * inside of the corresponding form value. In the future, we may consider uploading to S3
 * and storing an S3 URL as a form value, but embeddeding the file inside of the
 * claim will make it easier to integrate with state backends and likely means we
 * can get something out the door sooner.
 */
const File: React.FC<Props> = (props) => {
  const { question } = props
  const { values, setValue } = useContext(FormContext)
  const value = values[question.id] as FileValues | undefined

  const onDrop = (acceptedFiles: File[], rejectedFiles: File[], event: DropEvent) => {
    console.log(acceptedFiles)
    console.log(rejectedFiles)
    console.log(event)

    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      // TODO: handle aborts + errors
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      // onload fired only after the read operation has finished
      reader.onload = () => {
        setValue(question, [
          ...(value || []),
          {
            name: file.name,
            type: file.type,
            size: file.size,
            contents: encode(reader.result as ArrayBuffer),
          },
        ])
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    minSize: 100, // arbitrary min > 0 (100B)
    maxSize: 4194304, // 4MB
    // This handler is fired both on valid and invalid files.
    onDrop,
    // Accept PNGs, JPGs and PDFs
    accept: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
  })

  const onRemove = () => {
    setValue(question, undefined)
  }

  const color = isDragActive || isFocused ? '#4776F6' : '#CCCCCC'

  // TODO: i18n the copy below
  return (
    <>
      <Box
        pad="medium"
        gap="small"
        alignContent="center"
        align="center"
        style={{
          outline: `2px dashed ${color}`,
          cursor: 'pointer',
        }}
        background={{
          color: '#F6F7F9',
        }}
        className="file-upload-box"
        margin={{ bottom: '12px' }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Paragraph margin={{ vertical: 'none' }} color="black">
          Drag and drop files here
        </Paragraph>
        <Paragraph margin={{ vertical: 'none' }} color="black">
          or
        </Paragraph>
        <Paragraph margin={{ vertical: 'none' }} color="#4776F6" style={{ display: 'flex', fontWeight: 600 }}>
          Choose a File
          <CircleIcon color="#4776F6" margin={{ left: '6px' }}>
            <FormNextLink color="white" className="file-upload-icon" />
          </CircleIcon>
        </Paragraph>
      </Box>
      {value &&
        value.map((v, i) => (
          <Box direction="row" pad="medum" height="75px" key={i} align="center" justify="between">
            <Box direction="row">
              {/* TODO: use other SVGs for PDF/JPEG/etc. when those are available */}
              <Image src="/file.jpg.svg" />
              <Paragraph margin={{ left: '12px', bottom: '12px' }}>{v.name}</Paragraph>
            </Box>
            <Box direction="row" align="center">
              <Paragraph margin={{ vertical: 'none', right: '12px' }}>Uploaded!</Paragraph>
              <CircleIcon color="#4776F6">
                <Checkmark color="white" style={{ width: '12px', height: '12px' }} />
              </CircleIcon>
              <Button
                icon={<FormClose />}
                onClick={onRemove}
                size="small"
                margin={{ left: '20px' }}
                style={{
                  borderRadius: '20px',
                  padding: '3px',
                }}
                primary={true}
                color="#eee"
                hoverIndicator={{
                  color: 'lightgrey',
                }}
              />
            </Box>
          </Box>
        ))}
    </>
  )
}

export default File
