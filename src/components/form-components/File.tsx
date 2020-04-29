import React, { useContext } from 'react'
import { Question, FileValues, FileValue } from '../../lib/types'
import { FormContext } from '../../contexts/form'
import { FormNextLink, Checkmark, FormClose } from 'grommet-icons'
import { useDropzone } from 'react-dropzone'
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
  const { values, setValue, translateByID } = useContext(FormContext)
  const value = values[question.id] as FileValues | undefined

  const onDrop = async (acceptedFiles: File[]) => {
    const files = await Promise.all(
      acceptedFiles.map((file) => {
        return new Promise<FileValue | undefined>((resolve) => {
          const reader = new FileReader()

          reader.onerror = () => {
            resolve()
          }
          reader.onabort = () => {
            resolve()
          }
          // onload fired only after the read operation has finished
          reader.onload = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              contents: encode(reader.result as ArrayBuffer),
            })
          }
          reader.readAsArrayBuffer(file)
        })
      })
    )

    setValue(question, [...(value || []), ...(files.filter((f) => !!f) as FileValue[])])
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
          {translateByID('file-uploader-drag-drop')}
        </Paragraph>
        <Paragraph margin={{ vertical: 'none' }} color="black">
          {translateByID('file-uploader-or')}
        </Paragraph>
        <Paragraph margin={{ vertical: 'none' }} color="#4776F6" style={{ display: 'flex', fontWeight: 600 }}>
          {translateByID('file-uploader-choose-file')}
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
              <Image src="/file.jpg.svg" width="45px" />
              <Paragraph margin={{ left: '12px', bottom: '12px' }}>{v.name}</Paragraph>
            </Box>
            <Box direction="row" align="center">
              <Paragraph margin={{ vertical: 'none', right: '12px' }}>
                {translateByID('file-uploader-uploaded')}
              </Paragraph>
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
